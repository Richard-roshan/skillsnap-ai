import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Circle, Lock, BookOpen, ExternalLink } from 'lucide-react';

const ROADMAPS = {
  web: {
    title: 'Full Stack Web Developer',
    nodes: [
      {
        id: 1,
        title: 'Phase 1: Internet & Git Fundamentals',
        desc: 'Learn how browsers work, HTTP request-response cycles, and command-line basic operations. Learn Git branching and GitHub pushes.',
        status: 'completed',
        resources: [
          { name: 'Git & GitHub Crash Course (FreeCodeCamp)', url: 'https://youtube.com' },
          { name: 'How the Web Works (MDN Web Docs)', url: 'https://developer.mozilla.org' }
        ]
      },
      {
        id: 2,
        title: 'Phase 2: Frontend Core (HTML, CSS & React)',
        desc: 'Learn semantical tags, responsive layouts, CSS Flexbox/Grid. Transition into modern React functional components, hooks (useState, useEffect), and fetch state management.',
        status: 'active',
        resources: [
          { name: 'React Beginner Course (Scrimba)', url: 'https://scrimba.com' },
          { name: 'CSS Grid Comprehensive Guide (CSS-Tricks)', url: 'https://css-tricks.com' }
        ]
      },
      {
        id: 3,
        title: 'Phase 3: Backend & Databases (Node & PostgreSQL)',
        desc: 'Learn asynchronous Javascript on servers. Set up REST APIs using Express.js. Create relational tables, index constraints, and perform SQL joins inside Postgres.',
        status: 'locked',
        resources: [
          { name: 'NodeJS & Express Tutorial (YouTube)', url: 'https://youtube.com' },
          { name: 'PostgreSQL Bootcamp (Udemy Free)', url: 'https://udemy.com' }
        ]
      },
      {
        id: 4,
        title: 'Phase 4: Devops & Deployments (Docker & AWS)',
        desc: 'Learn deployment containers. Setup Dockerfiles and docker-compose configurations. Configure reverse proxies (Nginx) and host code on AWS EC2 or Render.',
        status: 'locked',
        resources: [
          { name: 'Docker Crash Course (Traversy)', url: 'https://youtube.com' }
        ]
      }
    ]
  },
  mobile: {
    title: 'Mobile App Engineer',
    nodes: [
      {
        id: 1,
        title: 'Phase 1: Dart Fundamentals',
        desc: 'Master basic Dart syntax, object-oriented principles, extensions, async-await streams, and future handlers.',
        status: 'completed',
        resources: [
          { name: 'Dart Programming Bootcamp', url: 'https://dart.dev' }
        ]
      },
      {
        id: 2,
        title: 'Phase 2: Flutter Layouts & State',
        desc: 'Assemble cross-platform views using Rows, Columns, and ListViews. Manage state using Providers or ValueListenableBuilders.',
        status: 'active',
        resources: [
          { name: 'Flutter Layout Guide (Flutter Dev)', url: 'https://flutter.dev' }
        ]
      },
      {
        id: 3,
        title: 'Phase 3: Native Integration & APIs',
        desc: 'Read offline databases (SQLite), trigger platform-specific hardware APIs (camera, geolocation), and integrate HTTP services.',
        status: 'locked',
        resources: []
      }
    ]
  }
};

export default function CareerRoadmapScreen({ onBack, showToast }) {
  const [selectedKey, setSelectedKey] = useState('web');
  const [expandedNodeId, setExpandedNodeId] = useState(2); // Auto expand node 2 (active)

  const activeRoadmap = ROADMAPS[selectedKey] || ROADMAPS.web;

  const handleSelectNode = (node) => {
    if (expandedNodeId === node.id) {
      setExpandedNodeId(null);
    } else {
      setExpandedNodeId(node.id);
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="node-icon completed" size={24} />;
      case 'active':
        return <Circle className="node-icon active" size={24} strokeWidth={3} />;
      default:
        return <Lock className="node-icon locked" size={20} />;
    }
  };

  return (
    <div className="sub-screen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">Interactive Career Roadmap</h3>
        <div style={{ width: 22 }} />
      </div>

      <div className="sub-screen-content roadmap-scroll">
        {/* Dropdown selector */}
        <div className="card-premium selector-card">
          <label className="dropdown-label">Target Role</label>
          <select
            className="roadmap-select"
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
              setExpandedNodeId(2); // reset expanded node
            }}
          >
            <option value="web">Full Stack Web Developer (92% Match)</option>
            <option value="mobile">Mobile App Engineer (85% Match)</option>
          </select>
        </div>

        {/* Roadmap Nodes Timeline */}
        <div className="roadmap-timeline">
          {activeRoadmap.nodes.map((node, index) => {
            const isExpanded = expandedNodeId === node.id;
            return (
              <div 
                key={node.id} 
                className={`roadmap-node-wrapper ${node.status} ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Node Top bar header */}
                <div className="node-header" onClick={() => handleSelectNode(node)}>
                  <div className="status-icon-box">
                    {renderStatusIcon(node.status)}
                    {index < activeRoadmap.nodes.length - 1 && (
                      <div className="timeline-connector-line" />
                    )}
                  </div>
                  
                  <div className="node-title-box">
                    <h4 className="node-title">{node.title}</h4>
                    <span className="node-badge-text">
                      {node.status === 'completed' && 'Completed'}
                      {node.status === 'active' && 'In Progress'}
                      {node.status === 'locked' && 'Locked'}
                    </span>
                  </div>
                </div>

                {/* Node details block */}
                {isExpanded && (
                  <div className="node-details-expansion fade-in">
                    <p className="node-desc">{node.desc}</p>
                    
                    {node.resources && node.resources.length > 0 && (
                      <div className="node-resources-list">
                        <h5>
                          <BookOpen size={14} /> Recommended Free Resources
                        </h5>
                        <div className="resource-links">
                          {node.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="resource-anchor"
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast(`Opening resource: ${res.name}`);
                              }}
                            >
                              <span>{res.name}</span>
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .roadmap-scroll {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .selector-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px;
        }
        
        .dropdown-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        
        .roadmap-select {
          height: 42px;
          padding: 0 12px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          outline: none;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        
        /* TIMELINE STRUCTURE */
        .roadmap-timeline {
          display: flex;
          flex-direction: column;
          padding-left: 10px;
        }
        
        .roadmap-node-wrapper {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-bottom: 24px;
        }
        
        .node-header {
          display: flex;
          gap: 16px;
          align-items: center;
          cursor: pointer;
        }
        
        .status-icon-box {
          position: relative;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .node-icon.completed { color: var(--success); }
        .node-icon.active { color: var(--primary); }
        .node-icon.locked { color: var(--text-muted); }
        
        .timeline-connector-line {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: calc(100% + 14px); /* stretch down to next node */
          background-color: var(--border-color);
          z-index: 1;
        }
        .roadmap-node-wrapper.completed .timeline-connector-line {
          background-color: var(--success);
        }
        
        .node-title-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .node-title {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .roadmap-node-wrapper.locked .node-title {
          color: var(--text-muted);
        }
        
        .node-badge-text {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .roadmap-node-wrapper.completed .node-badge-text { color: var(--success); }
        .roadmap-node-wrapper.active .node-badge-text { color: var(--primary); }
        .roadmap-node-wrapper.locked .node-badge-text { color: var(--text-muted); }
        
        /* EXPANSION PANEL */
        .node-details-expansion {
          margin-left: 44px; /* align with title text */
          margin-top: 10px;
          padding: 16px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }
        
        .node-desc {
          font-size: 0.85rem;
          line-height: 1.45;
          color: var(--text-secondary);
        }
        
        .node-resources-list {
          margin-top: 14px;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .node-resources-list h5 {
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
        }
        
        .resource-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .resource-anchor {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          align-self: flex-start;
        }
        .resource-anchor:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
