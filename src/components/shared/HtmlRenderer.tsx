"use client";

import React from "react";
import DOMPurify from "dompurify";

interface HtmlRendererProps {
    content: string;
    className?: string;
    maxLength?: number;
}

/**
 * HtmlRenderer component safely renders HTML content
 * It sanitizes the HTML to prevent XSS attacks and optionally truncates long content
 */
export function HtmlRenderer({ content, className = "", maxLength }: HtmlRendererProps) {
    // Only run DOMPurify in the browser
    if (typeof window === "undefined") {
        return (
            <div className={className}>
                {maxLength && content.length > maxLength
                    ? `${content.substring(0, maxLength)}...`
                    : content}
            </div>
        );
    }

    // Sanitize HTML to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "u",
            "p",
            "br",
            "span",
            "div",
            "ul",
            "ol",
            "li",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "a",
            "blockquote",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
    });

    // Truncate if maxLength is specified
    let displayContent = sanitizedContent;
    if (maxLength) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = sanitizedContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";

        if (textContent.length > maxLength) {
            // Truncate the text content
            const truncatedText = textContent.substring(0, maxLength) + "...";
            displayContent = truncatedText;
        }
    }

    return (
        <div
            className={`html-content break-words ${className}`}
            dangerouslySetInnerHTML={{ __html: displayContent }}
        />
    );
}