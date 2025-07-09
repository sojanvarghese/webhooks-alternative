import React, { useState, useCallback } from "react";
import { Search, Down, Right, Copy } from "@bigbinary/neeto-icons";
import { Button, Input, Tooltip } from "@bigbinary/neetoui";

const JsonViewer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [viewMode, setViewMode] = useState("tree"); // 'tree' or 'raw'
  const [copiedPath, setCopiedPath] = useState("");

  // Enhanced data analysis
  const analyzeData = useCallback((obj) => {
    let totalKeys = 0;
    let totalValues = 0;
    let maxDepth = 0;

    const traverse = (data, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);
      if (typeof data === "object" && data !== null) {
        if (Array.isArray(data)) {
          totalValues += data.length;
          data.forEach((item) => traverse(item, depth + 1));
        } else {
          const keys = Object.keys(data);
          totalKeys += keys.length;
          keys.forEach((key) => traverse(data[key], depth + 1));
        }
      } else {
        totalValues++;
      }
    };

    traverse(obj);
    return { totalKeys, totalValues, maxDepth };
  }, []);

  const stats = analyzeData(data);

  const copyToClipboard = useCallback((text, path = "") => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(""), 2000);
  }, []);

  const JsonNode = ({ value, path = "", depth = 0, isLast = true }) => {
    const [isExpanded, setIsExpanded] = useState(expandAll || depth < 2);

    const isObject = typeof value === "object" && value !== null;
    const isArray = Array.isArray(value);
    const isEmpty = isObject && Object.keys(value).length === 0;

    // Search highlighting
    const isSearchMatch = searchTerm &&
      (path.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())));

    const getTypeColor = (val) => {
      if (val === null) return "#ef4444"; // red-500
      if (typeof val === "string") return "#059669"; // emerald-600
      if (typeof val === "number") return "#d97706"; // amber-600
      if (typeof val === "boolean") return "#7c3aed"; // violet-600
      return "#374151"; // gray-700
    };

    const getTypeIcon = (val) => {
      if (isArray) return "[]";
      if (isObject) return "{}";
      if (typeof val === "string") return '"';
      if (typeof val === "number") return "#";
      if (typeof val === "boolean") return val ? "✓" : "✗";
      if (val === null) return "∅";
      return "";
    };

    if (!isObject) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 0",
            backgroundColor: isSearchMatch ? "#fef3c7" : "transparent",
            borderRadius: "4px",
            paddingLeft: `${depth * 20}px`,
          }}
        >
          <span style={{
            color: "#9ca3af",
            fontSize: "12px",
            minWidth: "16px",
            fontWeight: 600
          }}>
            {getTypeIcon(value)}
          </span>
          <span
            style={{
              color: getTypeColor(value),
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 500,
              wordBreak: "break-all"
            }}
          >
            {typeof value === "string" ? `"${value}"` : String(value)}
          </span>
          <Tooltip content={copiedPath === path ? "Copied!" : "Copy value"}>
            <Button
              variant="text"
              icon={Copy}
              size="small"
              onClick={() => copyToClipboard(String(value), path)}
              style={{
                padding: "4px",
                minWidth: "auto",
                opacity: 0.6
              }}
            />
          </Tooltip>
        </div>
      );
    }

    const entries = isArray ?
      value.map((item, index) => [index, item]) :
      Object.entries(value);

    return (
      <div style={{ paddingLeft: depth > 0 ? `${depth * 20}px` : "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 0",
            cursor: isEmpty ? "default" : "pointer",
            backgroundColor: isSearchMatch ? "#fef3c7" : "transparent",
            borderRadius: "4px",
          }}
          onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
        >
          {!isEmpty && (
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              {isExpanded ? <Down size={12} /> : <Right size={12} />}
            </span>
          )}
          <span style={{
            color: "#9ca3af",
            fontSize: "12px",
            minWidth: "16px",
            fontWeight: 600
          }}>
            {getTypeIcon(value)}
          </span>
          <span style={{
            color: "#374151",
            fontSize: "13px",
            fontWeight: 600
          }}>
            {isArray ? `Array(${value.length})` : `Object(${Object.keys(value).length})`}
          </span>
          <Tooltip content={copiedPath === path ? "Copied!" : "Copy object"}>
            <Button
              variant="text"
              icon={Copy}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(JSON.stringify(value, null, 2), path);
              }}
              style={{
                padding: "4px",
                minWidth: "auto",
                opacity: 0.6
              }}
            />
          </Tooltip>
        </div>

        {!isEmpty && isExpanded && (
          <div style={{ marginTop: "4px" }}>
            {entries.map(([key, val], index) => {
              const currentPath = path ? `${path}.${key}` : String(key);
              return (
                <div key={currentPath} style={{ marginBottom: "2px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    paddingLeft: "20px"
                  }}>
                    <span style={{
                      color: "#2563eb",
                      fontSize: "13px",
                      fontWeight: 600,
                      minWidth: "fit-content",
                      marginTop: "2px"
                    }}>
                      {isArray ? `[${key}]` : `${key}:`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <JsonNode
                        value={val}
                        path={currentPath}
                        depth={depth + 1}
                        isLast={index === entries.length - 1}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Monaco', 'Consolas', monospace",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "#ffffff"
    }}>
      {/* Controls */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        borderRadius: "8px 8px 0 0"
      }}>
        <div style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "12px"
        }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              label="Tree"
              variant={viewMode === "tree" ? "primary" : "secondary"}
              size="small"
              onClick={() => setViewMode("tree")}
            />
            <Button
              label="Raw"
              variant={viewMode === "raw" ? "primary" : "secondary"}
              size="small"
              onClick={() => setViewMode("raw")}
            />
          </div>

          {viewMode === "tree" && (
            <>
              <Button
                label={expandAll ? "Collapse All" : "Expand All"}
                variant="secondary"
                size="small"
                onClick={() => setExpandAll(!expandAll)}
              />
              <div style={{ flex: 1, maxWidth: "200px" }}>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  size="small"
                  prefix={<Search size={16} />}
                />
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "12px",
          fontSize: "12px",
          color: "#6b7280"
        }}>
          <div>
            <span style={{ fontWeight: 600 }}>Keys:</span> {stats.totalKeys}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>Values:</span> {stats.totalValues}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>Depth:</span> {stats.maxDepth}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>Size:</span> {JSON.stringify(data).length}B
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: "16px",
        maxHeight: "500px",
        overflow: "auto",
        backgroundColor: "#ffffff"
      }}>
        {viewMode === "tree" ? (
          <JsonNode value={data} />
        ) : (
          <pre style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#374151"
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
