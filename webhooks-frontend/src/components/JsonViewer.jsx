import React, { useState } from "react";
import { Search, Down, Right } from "@bigbinary/neeto-icons";
import { Input, Tab, Tag } from "@bigbinary/neetoui";

// Enhanced JsonViewer component using NeetoUI design system
const JsonViewer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("tree"); // 'tree' or 'raw'

  // JsonNode component with NeetoUI design tokens
  const JsonNode = ({ value, path = "", depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const isObject = typeof value === "object" && value !== null;
    const isArray = Array.isArray(value);
    const isEmpty = isObject && Object.keys(value).length === 0;

    // Search highlighting with NeetoUI colors
    const isSearchMatch = searchTerm &&
      (path.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())));

    // Get value color using NeetoUI semantic colors
    const getValueColor = (val) => {
      if (val === null) return "rgb(var(--neeto-ui-error-500))";
      if (typeof val === "string") return "rgb(var(--neeto-ui-success-600))";
      if (typeof val === "number") return "rgb(var(--neeto-ui-warning-600))";
      if (typeof val === "boolean") return "rgb(var(--neeto-ui-info-600))";
      return "rgb(var(--neeto-ui-gray-800))";
    };

    // Render primitive values
    if (!isObject) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--neeto-ui-spacing-2)",
            padding: "2px 4px",
            backgroundColor: isSearchMatch ? "rgb(var(--neeto-ui-warning-100))" : "transparent",
            borderRadius: "var(--neeto-ui-rounded-sm)",
            paddingLeft: `${depth * 16}px`,
          }}
        >
          <span
            style={{
              color: getValueColor(value),
              fontFamily: "var(--neeto-ui-font-mono)",
              fontSize: "var(--neeto-ui-text-sm)",
              fontWeight: "var(--neeto-ui-font-medium)",
            }}
          >
            {typeof value === "string" ? `"${value}"` : String(value)}
          </span>
        </div>
      );
    }

    const entries = isArray ?
      value.map((item, index) => [index, item]) :
      Object.entries(value);

    return (
      <div style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--neeto-ui-spacing-2)",
            padding: "4px",
            cursor: isEmpty ? "default" : "pointer",
            backgroundColor: isSearchMatch ? "rgb(var(--neeto-ui-warning-100))" : "transparent",
            borderRadius: "var(--neeto-ui-rounded-sm)",
            transition: "background-color 0.2s ease",
          }}
          onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
          onMouseEnter={(e) => {
            if (!isEmpty && !isSearchMatch) {
              e.target.style.backgroundColor = "rgb(var(--neeto-ui-gray-100))";
            }
          }}
          onMouseLeave={(e) => {
            if (!isEmpty && !isSearchMatch) {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          {!isEmpty && (
            <span style={{ color: "rgb(var(--neeto-ui-gray-500))", fontSize: "var(--neeto-ui-text-xs)" }}>
              {isExpanded ? <Down size={12} /> : <Right size={12} />}
            </span>
          )}
          <Tag
            label={isArray ? `Array[${value.length}]` : `Object{${Object.keys(value).length}}`}
            type="outline"
            size="small"
          />
        </div>

        {!isEmpty && isExpanded && (
          <div style={{ marginTop: "var(--neeto-ui-spacing-1)" }}>
            {entries.map(([key, val], index) => {
              const currentPath = path ? `${path}.${key}` : String(key);
              return (
                <div key={currentPath} style={{ marginBottom: "2px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--neeto-ui-spacing-2)",
                    paddingLeft: "16px"
                  }}>
                    <span style={{
                      color: "rgb(var(--neeto-ui-primary-600))",
                      fontSize: "var(--neeto-ui-text-sm)",
                      fontWeight: "var(--neeto-ui-font-semibold)",
                      minWidth: "fit-content",
                      fontFamily: "var(--neeto-ui-font-mono)",
                    }}>
                      {isArray ? `[${key}]` : `${key}:`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <JsonNode
                        value={val}
                        path={currentPath}
                        depth={depth + 1}
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
      border: "1px solid rgb(var(--neeto-ui-gray-300))",
      borderRadius: "var(--neeto-ui-rounded-lg)",
      backgroundColor: "rgb(var(--neeto-ui-white))",
      overflow: "hidden",
      boxShadow: "var(--neeto-ui-shadow-sm)",
    }}>
      {/* Header with Tab component and search */}
      <div style={{
        padding: "var(--neeto-ui-spacing-3) var(--neeto-ui-spacing-4)",
        borderBottom: "1px solid rgb(var(--neeto-ui-gray-300))",
        backgroundColor: "rgb(var(--neeto-ui-gray-50))",
        display: "flex",
        gap: "var(--neeto-ui-spacing-4)",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Tab style={{
          "--neeto-ui-tab-active-color": "rgb(var(--neeto-ui-primary-600))",
          "--neeto-ui-tab-active-border-color": "rgb(var(--neeto-ui-primary-600))",
        }}>
          <Tab.Item
            id="tree"
            label="Tree View"
            onClick={() => setViewMode("tree")}
            active={viewMode === "tree"}
          />
          <Tab.Item
            id="raw"
            label="Raw JSON"
            onClick={() => setViewMode("raw")}
            active={viewMode === "raw"}
          />
        </Tab>

        {viewMode === "tree" && (
          <div style={{ minWidth: "200px" }}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys and values..."
              size="small"
              prefix={<Search size={14} />}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div style={{
        padding: "var(--neeto-ui-spacing-4)",
        maxHeight: "400px",
        overflow: "auto",
        backgroundColor: "rgb(var(--neeto-ui-white))",
        fontSize: "var(--neeto-ui-text-sm)",
      }}
      className="json-viewer-content"
      >
        {viewMode === "tree" ? (
          <JsonNode value={data} />
        ) : (
          <pre style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "var(--neeto-ui-text-sm)",
            lineHeight: "var(--neeto-ui-line-height-relaxed)",
            color: "rgb(var(--neeto-ui-gray-800))",
            fontFamily: "var(--neeto-ui-font-mono)",
            padding: "var(--neeto-ui-spacing-2)",
            backgroundColor: "rgb(var(--neeto-ui-gray-50))",
            borderRadius: "var(--neeto-ui-rounded)",
            border: "1px solid rgb(var(--neeto-ui-gray-200))",
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
