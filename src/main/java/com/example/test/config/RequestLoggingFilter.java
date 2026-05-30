package com.example.test.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Pattern;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    private static final Set<String> STATIC_PREFIXES = Set.of(
            "/css/", "/js/", "/images/", "/static/", "/favicon.ico"
    );
    private static final Set<String> STATIC_SUFFIXES = Set.of(
            ".map", ".css", ".js", ".png", ".ico", ".woff", ".woff2", ".ttf"
    );

    private static final Pattern SENSITIVE_KEY = Pattern.compile(
            "(\"(?:password|passwd|token|secret|authorization|apiKey|api_key|accessToken|access_token)\"\\s*:\\s*\")[^\"]+",
            Pattern.CASE_INSENSITIVE
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        if (isAsyncDispatch(request) || isStaticResource(request)) {
            chain.doFilter(request, response);
            return;
        }

        long start = System.currentTimeMillis();
        ContentCachingRequestWrapper wrapper = new ContentCachingRequestWrapper(request, 1024);

        try {
            chain.doFilter(wrapper, response);
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            byte[] body = wrapper.getContentAsByteArray();
            String bodyStr = body.length > 0 ? new String(body, StandardCharsets.UTF_8) : null;
            log.info(buildMessage(request, response, elapsed, bodyStr));
        }
    }

    private boolean isStaticResource(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri == null) return false;
        for (String prefix : STATIC_PREFIXES) {
            if (uri.startsWith(prefix)) return true;
        }
        for (String suffix : STATIC_SUFFIXES) {
            if (uri.endsWith(suffix)) return true;
        }
        return false;
    }

    private String maskSensitive(String body) {
        if (body == null || body.isEmpty()) return body;
        return SENSITIVE_KEY.matcher(body).replaceAll("$1***");
    }

    private String buildMessage(HttpServletRequest request, HttpServletResponse response,
                                 long elapsedMs, String body) {
        StringBuilder sb = new StringBuilder();
        sb.append(request.getMethod()).append(" ").append(request.getRequestURI());
        sb.append(" | ").append(response.getStatus());
        sb.append(" | ").append(elapsedMs).append("ms");

        Map<String, String[]> params = request.getParameterMap();
        if (!params.isEmpty()) {
            sb.append(" | params=");
            TreeMap<String, String[]> sorted = new TreeMap<>(params);
            boolean first = true;
            for (Map.Entry<String, String[]> e : sorted.entrySet()) {
                if (!first) sb.append(", ");
                sb.append(e.getKey()).append("=").append(String.join(",", e.getValue()));
                first = false;
            }
        }

        if (body != null && !body.isEmpty()) {
            sb.append(" | body=").append(maskSensitive(body));
        }

        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            sb.append(" | ip=").append(forwarded);
        }

        return sb.toString();
    }
}
