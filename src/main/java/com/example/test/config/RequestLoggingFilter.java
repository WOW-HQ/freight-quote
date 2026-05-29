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
import java.util.TreeMap;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

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
        return uri.startsWith("/css/") || uri.startsWith("/js/")
                || uri.startsWith("/images/") || uri.startsWith("/static/")
                || uri.startsWith("/favicon.ico") || uri.endsWith(".map")
                || uri.endsWith(".css") || uri.endsWith(".js")
                || uri.endsWith(".png") || uri.endsWith(".ico");
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
            sb.append(" | body=").append(body);
        }

        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            sb.append(" | ip=").append(forwarded);
        }

        return sb.toString();
    }
}
