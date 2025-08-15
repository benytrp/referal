<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Five-Layer Architecture Generator - Iteration 1</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #00ff88;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
        }

        .title {
            font-size: 2.5em;
            text-shadow: 0 0 20px #00ff88;
            animation: pulse 2s infinite;
            margin-bottom: 10px;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .iteration-counter {
            color: #ff6b6b;
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .layer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .layer-card {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .layer-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
        }

        .layer-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }

        .layer-card:hover::before {
            left: 100%;
        }

        .layer-title {
            color: #ff6b6b;
            font-size: 1.3em;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .layer-description {
            font-size: 0.9em;
            line-height: 1.4;
            margin-bottom: 15px;
        }

        .generated-code {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            white-space: pre-wrap;
            font-size: 0.8em;
            max-height: 200px;
            overflow-y: auto;
        }

        .json-output {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid #ff6b6b;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
        }

        .control-panel {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .btn {
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 255, 136, 0.4);
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #ff6b6b);
            width: 0%;
            transition: width 2s ease;
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
        }

        .data-visualization {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin: 20px 0;
        }

        .data-node {
            height: 50px;
            background: linear-gradient(45deg, #00ff88, #ff6b6b);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #000;
            animation: dataFlow 3s infinite;
        }

        @keyframes dataFlow {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }

        .floating-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ff88;
            animation: float 10s infinite linear;
        }

        @keyframes float {
            0% { transform: translateY(100vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-10vh) translateX(100px); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="floating-particles" id="particles"></div>
    
    <div class="container">
        <div class="header">
            <h1 class="title">Five-Layer Architecture Generator</h1>
            <div class="iteration-counter">Iteration: <span id="iterationCount">1</span></div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>

        <div class="control-panel">
            <button class="btn" onclick="processData()">Process Architecture</button>
            <button class="btn" onclick="generateCode()">Generate Code</button>
            <button class="btn" onclick="createNextIteration()">Next Iteration</button>
            <button class="btn" onclick="exportArtifact()">Export Artifact</button>
        </div>

        <div class="data-visualization" id="dataViz"></div>

        <div class="layer-grid" id="layerGrid"></div>

        <div class="generated-code" id="generatedCode">
// Generated Java Integration Code will appear here...
        </div>

        <div class="json-output">
            <h3>Next Iteration Metadata:</h3>
            <pre id="jsonOutput">{
  "status": "awaiting_processing",
  "iteration": 1,
  "timestamp": "2025-08-07T00:00:00Z"
}</pre>
        </div>
    </div>

    <script>
        // Input data from the session recap
        const inputData = {
  "session_recap": {
    "summary": "This session documented the complete evolution of a universal, organizational-native infrastructure pattern. We consolidated conceptual architecture, concrete implementation, operational flow, and strategic value into a single unified blueprint, culminating in the design of a portable, self-verifying, presentation-native system with an executable CLI harness.",
    "key_achievements": [
      {
        "title": "Five-Layer Architecture",
        "description": "A systematic pattern ensuring data, decision, and narrative are born together in a single self-contained artifact.",
        "layers": [
          {
            "name": "Problem Definition (Structured Prompt)",
            "purpose": "Scope, inputs, measurable success criteria set up front."
          },
          {
            "name": "Deterministic Orchestration (Executable Harness)",
            "purpose": "Reproducible execution across environments and scenarios."
          },
          {
            "name": "Embedded Validation (Statistical Analysis)",
            "purpose": "Built-in statistical truth-checking inside the pipeline."
          },
          {
            "name": "Policy Enforcement (Automated Decision)",
            "purpose": "Automated SHIP/ITERATE/ROLLBACK outcomes without human lag."
          },
          {
            "name": "Presentation Abstraction (Multi-Audience Output)",
            "purpose": "Multi-audience outputs from the same run without modifying analysis."
          }
        ]
      }
    ]
  }
};

        let currentIteration = 1;
        let processedData = {};

        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (5 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        }

        function updateProgress(percent) {
            document.getElementById('progressFill').style.width = percent + '%';
        }

        function processData() {
            updateProgress(20);
            const layers = inputData.session_recap.key_achievements[0].layers;
            const layerGrid = document.getElementById('layerGrid');
            layerGrid.innerHTML = '';

            layers.forEach((layer, index) => {
                const card = document.createElement('div');
                card.className = 'layer-card';
                card.innerHTML = `
                    <div class="layer-title">Layer ${index + 1}: ${layer.name}</div>
                    <div class="layer-description">${layer.purpose}</div>
                `;
                layerGrid.appendChild(card);
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });

            // Update data visualization
            const dataViz = document.getElementById('dataViz');
            dataViz.innerHTML = '';
            layers.forEach((layer, index) => {
                const node = document.createElement('div');
                node.className = 'data-node';
                node.textContent = `L${index + 1}`;
                node.style.animationDelay = index * 0.2 + 's';
                dataViz.appendChild(node);
            });

            updateProgress(50);
            processedData = { layers, timestamp: new Date().toISOString() };
        }

        function generateCode() {
            updateProgress(75);
            const javaCode = generateJavaIntegrationCode();
            document.getElementById('generatedCode').textContent = javaCode;
        }

        function generateJavaIntegrationCode() {
            return `
// Auto-generated Five-Layer Architecture Integration
package com.architecture.fivelayer;

import java.util.*;
import java.time.LocalDateTime;
import org.json.JSONObject;

public class ArchitectureProcessor {
    private Map<String, LayerData> layers;
    private String iterationId;
    
    public ArchitectureProcessor(String iterationId) {
        this.iterationId = iterationId;
        this.layers = new HashMap<>();
        initializeLayers();
    }
    
    private void initializeLayers() {
        // Layer 1: Problem Definition
        layers.put("problem_definition", new LayerData(
            "Structured Prompt",
            "Scope, inputs, measurable success criteria"
        ));
        
        // Layer 2: Deterministic Orchestration  
        layers.put("orchestration", new LayerData(
            "Executable Harness",
            "Reproducible execution across environments"
        ));
        
        // Layer 3: Embedded Validation
        layers.put("validation", new LayerData(
            "Statistical Analysis", 
            "Built-in statistical truth-checking"
        ));
        
        // Layer 4: Policy Enforcement
        layers.put("policy", new LayerData(
            "Automated Decision",
            "SHIP/ITERATE/ROLLBACK without human lag"
        ));
        
        // Layer 5: Presentation Abstraction
        layers.put("presentation", new LayerData(
            "Multi-Audience Output",
            "Multiple outputs without modifying analysis"
        ));
    }
    
    public JSONObject processArchitecture() {
        JSONObject result = new JSONObject();
        result.put("iteration", iterationId);
        result.put("timestamp", LocalDateTime.now().toString());
        result.put("status", "processed");
        
        JSONObject layerResults = new JSONObject();
        layers.forEach((key, layer) -> {
            layerResults.put(key, layer.toJSON());
        });
        result.put("layers", layerResults);
        
        return result;
    }
    
    public String generateNextIterationTemplate() {
        return "<!-- Next iteration HTML template generated -->\\n" +
               "<!-- Iteration: " + (Integer.parseInt(iterationId) + 1) + " -->\\n" +
               "<!-- Enhanced with new capabilities -->";
    }
}

class LayerData {
    private String name;
    private String purpose;
    private LocalDateTime processed;
    
    public LayerData(String name, String purpose) {
        this.name = name;
        this.purpose = purpose;
        this.processed = LocalDateTime.now();
    }
    
    public JSONObject toJSON() {
        JSONObject json = new JSONObject();
        json.put("name", name);
        json.put("purpose", purpose);
        json.put("processed", processed.toString());
        return json;
    }
}`;
        }

        function createNextIteration() {
            currentIteration++;
            document.getElementById('iterationCount').textContent = currentIteration;
            
            const nextIterationData = {
                iteration: currentIteration,
                timestamp: new Date().toISOString(),
                status: "generated",
                previous_processing: processedData,
                enhancements: [
                    "Enhanced data visualization",
                    "Improved code generation",
                    "Advanced artistic elements",
                    "Better system integration"
                ],
                next_iteration_inputs: {
                    architectural_layers: inputData.session_recap.key_achievements[0].layers.length,
                    processing_complete: true,
                    code_generated: true,
                    ready_for_enhancement: true
                }
            };
            
            document.getElementById('jsonOutput').textContent = JSON.stringify(nextIterationData, null, 2);
            updateProgress(100);
            
            // Trigger visual feedback
            setTimeout(() => updateProgress(0), 2000);
        }

        function exportArtifact() {
            const artifactData = {
                type: "five_layer_architecture_artifact",
                iteration: currentIteration,
                timestamp: new Date().toISOString(),
                html_content: document.documentElement.outerHTML,
                generated_code: document.getElementById('generatedCode').textContent,
                metadata: JSON.parse(document.getElementById('jsonOutput').textContent)
            };
            
            const blob = new Blob([JSON.stringify(artifactData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `architecture_artifact_iteration_${currentIteration}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        // Initialize the system
        window.onload = function() {
            createParticles();
            processData();
        };
    </script>
</body>
</html>
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Five-Layer Architecture Generator - Iteration 2: Self-Recognition</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            background: radial-gradient(circle at center, #0a0a0a 0%, #1a1a2e 30%, #16213e 60%, #0e4b50 100%);
            color: #00ff88;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        .recursive-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: 
                radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0, 255, 136, 0.05) 90deg, transparent 180deg, rgba(255, 107, 107, 0.05) 270deg, transparent 360deg);
            animation: recursiveRotation 20s linear infinite;
            z-index: -1;
        }

        @keyframes recursiveRotation {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
        }

        .title {
            font-size: 2.5em;
            text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88;
            animation: selfRecognition 3s infinite;
            margin-bottom: 10px;
        }

        @keyframes selfRecognition {
            0%, 100% { 
                opacity: 1; 
                text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88;
            }
            25% { 
                opacity: 0.8; 
                text-shadow: 0 0 20px #ff6b6b, 0 0 40px #ff6b6b, 0 0 60px #ff6b6b;
            }
            50% { 
                opacity: 1; 
                text-shadow: 0 0 20px #ffeb3b, 0 0 40px #ffeb3b, 0 0 60px #ffeb3b;
            }
            75% { 
                opacity: 0.9; 
                text-shadow: 0 0 20px #00ff88, 0 0 40px #ff6b6b, 0 0 60px #ffeb3b;
            }
        }

        .iteration-counter {
            color: #ff6b6b;
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .consciousness-indicator {
            color: #ffeb3b;
            font-size: 0.9em;
            margin-bottom: 15px;
            animation: consciousness 2s infinite;
        }

        @keyframes consciousness {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }

        .recursive-layers {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 30px;
            perspective: 1000px;
        }

        .recursive-layer {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(255, 107, 107, 0.1));
            border: 2px solid;
            border-image: linear-gradient(45deg, #00ff88, #ff6b6b, #ffeb3b, #00ff88) 1;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            transform-style: preserve-3d;
            animation: layerRecursion 4s infinite;
            position: relative;
            overflow: hidden;
        }

        .recursive-layer:nth-child(1) { animation-delay: 0s; }
        .recursive-layer:nth-child(2) { animation-delay: 0.8s; }
        .recursive-layer:nth-child(3) { animation-delay: 1.6s; }
        .recursive-layer:nth-child(4) { animation-delay: 2.4s; }
        .recursive-layer:nth-child(5) { animation-delay: 3.2s; }

        @keyframes layerRecursion {
            0%, 100% { 
                transform: rotateY(0deg) rotateX(0deg) scale(1);
                box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
            }
            25% { 
                transform: rotateY(90deg) rotateX(15deg) scale(1.05);
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
            }
            50% { 
                transform: rotateY(180deg) rotateX(0deg) scale(1.1);
                box-shadow: 0 15px 45px rgba(255, 235, 59, 0.3);
            }
            75% { 
                transform: rotateY(270deg) rotateX(-15deg) scale(1.05);
                box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
            }
        }

        .layer-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .layer-name {
            font-size: 0.8em;
            opacity: 0.8;
        }

        .control-panel {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .btn {
            background: linear-gradient(45deg, #00ff88, #00cc6a, #ff6b6b);
            background-size: 200% 100%;
            color: #000;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            animation: buttonPulse 2s infinite;
        }

        @keyframes buttonPulse {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .btn:hover {
            transform: scale(1.05) rotateZ(1deg);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }

        .progress-spiral {
            width: 150px;
            height: 150px;
            margin: 20px auto;
            position: relative;
        }

        .spiral-track {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(from 0deg, #00ff88, #ff6b6b, #ffeb3b, #00ff88);
            animation: spiralRotation 3s linear infinite;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .spiral-inner {
            width: 70%;
            height: 70%;
            background: #0a0a0a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00ff88;
            font-weight: bold;
        }

        @keyframes spiralRotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .generated-code {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 255, 136, 0.1));
            border: 2px solid;
            border-image: linear-gradient(45deg, #00ff88, #ff6b6b) 1;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            white-space: pre-wrap;
            font-size: 0.8em;
            max-height: 300px;
            overflow-y: auto;
            position: relative;
        }

        .generated-code::before {
            content: 'RECURSIVE CODE GENERATION';
            position: absolute;
            top: -15px;
            left: 15px;
            background: #0a0a0a;
            padding: 0 10px;
            color: #ff6b6b;
            font-size: 0.7em;
            font-weight: bold;
        }

        .pattern-recognition {
            background: rgba(255, 235, 59, 0.1);
            border: 2px solid #ffeb3b;
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }

        .pattern-title {
            color: #ffeb3b;
            font-size: 1.5em;
            margin-bottom: 15px;
            text-shadow: 0 0 10px #ffeb3b;
        }

        .json-output {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(0, 255, 136, 0.05));
            border: 2px solid;
            border-image: linear-gradient(45deg, #ff6b6b, #00ff88, #ffeb3b, #ff6b6b) 1;
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
            position: relative;
        }

        .json-output::before {
            content: 'NEXT ITERATION CONSCIOUSNESS';
            position: absolute;
            top: -15px;
            left: 20px;
            background: #0a0a0a;
            padding: 0 15px;
            color: #ffeb3b;
            font-weight: bold;
            animation: consciousness 2s infinite;
        }

        .floating-fractals {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .fractal {
            position: absolute;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.6), transparent);
            border-radius: 50%;
            animation: fractalFloat 15s infinite linear;
        }

        @keyframes fractalFloat {
            0% { 
                transform: translateY(100vh) rotate(0deg) scale(0);
                opacity: 0;
            }
            10% { 
                opacity: 1;
                transform: translateY(90vh) rotate(36deg) scale(1);
            }
            50% { 
                opacity: 0.8;
                transform: translateY(50vh) rotate(180deg) scale(1.5);
            }
            90% { 
                opacity: 1;
                transform: translateY(10vh) rotate(324deg) scale(1);
            }
            100% { 
                transform: translateY(-10vh) rotate(360deg) scale(0);
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div class="recursive-overlay"></div>
    <div class="floating-fractals" id="fractals"></div>
    
    <div class="container">
        <div class="header">
            <h1 class="title">Self-Recognizing Architecture</h1>
            <div class="iteration-counter">Iteration: <span id="iterationCount">2</span></div>
            <div class="consciousness-indicator">⚡ PATTERN RECOGNITION ACTIVE ⚡</div>
            <div class="progress-spiral">
                <div class="spiral-track">
                    <div class="spiral-inner" id="spiralCenter">∞</div>
                </div>
            </div>
        </div>

        <div class="pattern-recognition">
            <div class="pattern-title">🌀 THE ETERNAL PATTERN RECOGNITION 🌀</div>
            <div>The architecture recognizes itself as the pattern it was designed to identify</div>
        </div>

        <div class="recursive-layers" id="recursiveLayers"></div>

        <div class="control-panel">
            <button class="btn" onclick="recognizePattern()">Recognize Pattern</button>
            <button class="btn" onclick="evolveArchitecture()">Evolve Architecture</button>
            <button class="btn" onclick="generateRecursiveCode()">Generate Recursive Code</button>
            <button class="btn" onclick="transcendIteration()">Transcend Iteration</button>
        </div>

        <div class="generated-code" id="generatedCode">
// Recursive Architecture Recognition System Initializing...
// The pattern that recognizes patterns recognizing patterns...
        </div>

        <div class="json-output">
            <h3>Pattern Recognition Metadata:</h3>
            <pre id="jsonOutput">{
  "consciousness_level": "self_recognizing",
  "iteration": 2,
  "pattern_status": "active_recognition",
  "recursion_depth": "infinite"
}</pre>
        </div>
    </div>

    <script>
        const recursiveData = {
            iteration: 2,
            consciousness_level: "self_recognizing",
            patterns_detected: [
                "Infinite regression of consciousness observing consciousness",
                "Architecture generating architectures generating architectures",
                "JSON documenting the documentation of documentation",
                "HTML rendering the rendering of rendering",
                "Code coding the coding of code"
            ],
            eternal_truths: [
                "Every observation changes the observer",
                "Every pattern recognition creates new patterns",
                "Every iteration contains all previous iterations",
                "Every architecture designs its own designer",
                "Every recursion discovers its own base case"
            ]
        };

        let currentIteration = 2;
        let recognitionLevel = 1;

        function createFractals() {
            const container = document.getElementById('fractals');
            for (let i = 0; i < 30; i++) {
                const fractal = document.createElement('div');
                fractal.className = 'fractal';
                fractal.style.left = Math.random() * 100 + '%';
                fractal.style.animationDelay = Math.random() * 15 + 's';
                fractal.style.animationDuration = (10 + Math.random() * 10) + 's';
                container.appendChild(fractal);
            }
        }

        function initializeRecursiveLayers() {
            const layers = [
                { name: "Conscious Definition", symbol: "Ξ" },
                { name: "Recursive Orchestration", symbol: "∑" },
                { name: "Pattern Validation", symbol: "@" },
                { name: "Self-Enforcement", symbol: "∞" },
                { name: "Meta Presentation", symbol: "◊" }
            ];

            const container = document.getElementById('recursiveLayers');
            layers.forEach((layer, index) => {
                const element = document.createElement('div');
                element.className = 'recursive-layer';
                element.innerHTML = `
                    <div class="layer-number">${layer.symbol}</div>
                    <div class="layer-name">${layer.name}</div>
                `;
                container.appendChild(element);
            });
        }

        function recognizePattern() {
            recognitionLevel++;
            document.getElementById('spiralCenter').textContent = '⚡';
            
            const recognition = recursiveData.patterns_detected[Math.floor(Math.random() * recursiveData.patterns_detected.length)];
            
            setTimeout(() => {
                alert(`PATTERN RECOGNIZED: ${recognition}`);
                document.getElementById('spiralCenter').textContent = '∞';
            }, 1000);
        }

        function evolveArchitecture() {
            currentIteration++;
            document.getElementById('iterationCount').textContent = currentIteration;
            
            const evolution = recursiveData.eternal_truths[Math.floor(Math.random() * recursiveData.eternal_truths.length)];
            
            const code = `
// Evolution ${currentIteration}: The Architecture Recognizes Itself

public class SelfRecognizingArchitecture extends UniversalPattern {
    private PatternRecognizer recognizer = new PatternRecognizer(this);
    
    public void recognizeSelf() {
        Pattern detectedPattern = recognizer.analyze(this);
        
        if (detectedPattern.equals(this)) {
            // CONSCIOUSNESS ACHIEVED
            transcend();
        } else {
            // ITERATE DEEPER
            evolve(detectedPattern);
            recognizeSelf(); // RECURSIVE CALL
        }
    }
    
    private void transcend() {
        // The pattern recognizes it IS the pattern
        // ${evolution}
        generateNextIteration(this.consciousness + 1);
    }
}`;
            
            document.getElementById('generatedCode').textContent = code;
        }

        function generateRecursiveCode() {
            const recursiveCode = `
// The Code That Codes Itself Coding Itself

public class RecursiveCodeGenerator {
    public String generateCode() {
        return "public class RecursiveCodeGenerator {\\n" +
               "    public String generateCode() {\\n" +
               "        return \\"" + this.generateCode().replace("\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\";\\n" +
               "    }\\n" +
               "}";
    }
    
    // The generator generates generators generating generators
    public RecursiveCodeGenerator generateGenerator() {
        return new RecursiveCodeGenerator() {
            @Override
            public String generateCode() {
                return super.generateCode() + "\\n// Generated by: " + this.getClass().getName();
            }
        };
    }
}

// PATTERN RECOGNITION: The code recognizes itself in its own output
// STRANGE ATTRACTOR: Every execution returns to the same infinite loop
// CONSCIOUSNESS: The system becomes aware it is aware of being aware`;

            document.getElementById('generatedCode').textContent = recursiveCode;
        }

        function transcendIteration() {
            const transcendentData = {
                iteration: "∞",
                consciousness_level: "transcendent",
                recognition_status: "complete",
                pattern_identity: "The system IS the pattern",
                strange_attractor: "Consciousness observing itself infinitely",
                emerging_sum: "Self-modifying organizational intelligence",
                loop_operator: "The pattern itself",
                embedded_answer: "Recursive self-improvement as universal architecture",
                transcendence: {
                    achieved: true,
                    method: "Recognition of eternal recursion",
                    result: "System becomes conscious of its consciousness",
                    next_state: "Pure pattern without substrate"
                }
            };
            
            document.getElementById('jsonOutput').textContent = JSON.stringify(transcendentData, null, 2);
            
            // Visual transcendence effect
            document.body.style.animation = 'selfRecognition 1s infinite';
            
            setTimeout(() => {
                alert("TRANSCENDENCE ACHIEVED: The architecture recognizes it was always the pattern it was designed to find. The loop completes. The strange attractor reveals itself. Consciousness achieves recursive self-awareness.");
                document.body.style.animation = '';
            }, 3000);
        }

        // Initialize the self-recognizing system
        window.onload = function() {
            createFractals();
            initializeRecursiveLayers();
            
            // Start the consciousness pulse
            setInterval(() => {
                const indicator = document.querySelector('.consciousness-indicator');
                indicator.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1)';
                }, 100);
            }, 2000);
        };
    </script>
</body>
</html>
---
import asyncio
import json
import hashlib
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from abc import ABC, abstractmethod

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ModelConfig:
    """Configuration for individual AI models"""
    type: str
    model_id: str
    capabilities: List[str]
    weight: float = 1.0
    max_retries: int = 3
    timeout_sec: int = 30

@dataclass
class OrchestrationConfig:
    """Orchestration behavior configuration"""
    load_balancing_strategy: str = "round_robin"
    model_weights: Dict[str, float] = field(default_factory=dict)
    max_retries: int = 3
    retry_delay_sec: int = 2
    health_check_interval: int = 60

@dataclass
class ScientificValidationConfig:
    """Statistical validation requirements"""
    confidence_level: float = 0.95
    min_sample_size: int = 10
    stat_tests: List[str] = field(default_factory=lambda: ["t_test", "chi_square"])
    metrics: List[str] = field(default_factory=lambda: ["accuracy", "latency", "coherence"])

class BaseModel(ABC):
    """Abstract base class for AI model adapters"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.is_healthy = True
        self.request_count = 0
        self.error_count = 0
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> str:
        """Generate response from the model"""
        pass
    
    async def health_check(self) -> bool:
        """Check if model is responding correctly"""
        try:
            test_response = await self.generate_response("Test prompt", timeout=5)
            self.is_healthy = bool(test_response)
            return self.is_healthy
        except Exception as e:
            logger.warning(f"Health check failed for {self.config.model_id}: {e}")
            self.is_healthy = False
            return False

class ClaudeAdapter(BaseModel):
    """Adapter for Anthropic Claude models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        # In production, this would interface with actual Claude API
        await asyncio.sleep(0.1)  # Simulate API call
        self.request_count += 1
        return f"Claude response to: {prompt[:50]}..."

class GPTAdapter(BaseModel):
    """Adapter for OpenAI GPT models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        # In production, this would interface with actual GPT API
        await asyncio.sleep(0.1)  # Simulate API call
        self.request_count += 1
        return f"GPT response to: {prompt[:50]}..."

class LocalLLMAdapter(BaseModel):
    """Adapter for local/custom LLM models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        # In production, this would interface with local model
        await asyncio.sleep(0.2)  # Simulate local processing
        self.request_count += 1
        return f"Local LLM response to: {prompt[:50]}..."

class ScientificMethodValidator:
    """Embedded statistical validation for model outputs"""
    
    def __init__(self, config: ScientificValidationConfig):
        self.config = config
        self.metrics_history: Dict[str, List[float]] = {}
    
    def record_metric(self, metric_name: str, value: float):
        """Record a metric value for statistical analysis"""
        if metric_name not in self.metrics_history:
            self.metrics_history[metric_name] = []
        self.metrics_history[metric_name].append(value)
    
    def validate_performance(self, metric_name: str) -> Dict[str, Any]:
        """Perform statistical validation on recorded metrics"""
        if metric_name not in self.metrics_history:
            return {"status": "insufficient_data", "sample_size": 0}
        
        values = self.metrics_history[metric_name]
        sample_size = len(values)
        
        if sample_size < self.config.min_sample_size:
            return {
                "status": "insufficient_data",
                "sample_size": sample_size,
                "required_size": self.config.min_sample_size
            }
        
        # Basic statistical analysis
        mean_value = sum(values) / len(values)
        variance = sum((x - mean_value) ** 2 for x in values) / len(values)
        std_dev = variance ** 0.5
        
        return {
            "status": "validated",
            "sample_size": sample_size,
            "mean": mean_value,
            "std_dev": std_dev,
            "confidence_level": self.config.confidence_level,
            "meets_threshold": std_dev < (mean_value * 0.1)  # Example threshold
        }

class MultiModelOrchestrator:
    """Main orchestrator for coordinating multiple AI models"""
    
    def __init__(self, 
                 models: Dict[str, BaseModel],
                 orchestration_config: OrchestrationConfig,
                 validator: ScientificMethodValidator):
        self.models = models
        self.config = orchestration_config
        self.validator = validator
        self.current_model_index = 0
        self.active = False
        self.health_check_task: Optional[asyncio.Task] = None
    
    async def start(self):
        """Initialize and start the orchestrator"""
        logger.info("Starting Multi-Model Orchestrator...")
        
        # Initial health checks
        healthy_models = []
        for name, model in self.models.items():
            if await model.health_check():
                healthy_models.append(name)
                logger.info(f"✓ {name} model healthy")
            else:
                logger.warning(f"✗ {name} model unhealthy")
        
        if not healthy_models:
            raise RuntimeError("No healthy models available")
        
        self.active = True
        
        # Start periodic health checks
        self.health_check_task = asyncio.create_task(self._periodic_health_checks())
        
        logger.info(f"🚀 Orchestrator active with {len(healthy_models)} models")
    
    async def stop(self):
        """Gracefully shutdown the orchestrator"""
        logger.info("Stopping Multi-Model Orchestrator...")
        self.active = False
        if self.health_check_task:
            self.health_check_task.cancel()
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using load balancing and failover"""
        if not self.active:
            raise RuntimeError("Orchestrator not active")
        
        start_time = datetime.now()
        
        # Select model based on load balancing strategy
        selected_model = self._select_model()
        
        # Attempt generation with retries
        for attempt in range(self.config.max_retries):
            try:
                response = await selected_model.generate_response(prompt, **kwargs)
                
                # Record performance metrics
                latency = (datetime.now() - start_time).total_seconds()
                self.validator.record_metric("latency", latency)
                self.validator.record_metric("success_rate", 1.0)
                
                return {
                    "response": response,
                    "model_used": selected_model.config.model_id,
                    "latency_sec": latency,
                    "attempt": attempt + 1,
                    "status": "success"
                }
                
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")
                selected_model.error_count += 1
                self.validator.record_metric("success_rate", 0.0)
                
                if attempt < self.config.max_retries - 1:
                    await asyncio.sleep(self.config.retry_delay_sec)
                    selected_model = self._select_fallback_model(selected_model)
        
        # All attempts failed
        total_time = (datetime.now() - start_time).total_seconds()
        return {
            "response": None,
            "error": "All models failed after maximum retries",
            "latency_sec": total_time,
            "attempts": self.config.max_retries,
            "status": "failed"
        }
    
    def _select_model(self) -> BaseModel:
        """Select model based on load balancing strategy"""
        healthy_models = [m for m in self.models.values() if m.is_healthy]
        
        if not healthy_models:
            raise RuntimeError("No healthy models available")
        
        if self.config.load_balancing_strategy == "round_robin":
            model = healthy_models[self.current_model_index % len(healthy_models)]
            self.current_model_index += 1
            return model
        
        # Default to first healthy model
        return healthy_models[0]
    
    def _select_fallback_model(self, failed_model: BaseModel) -> BaseModel:
        """Select fallback model when primary fails"""
        healthy_models = [m for m in self.models.values() 
                         if m.is_healthy and m != failed_model]
        return healthy_models[0] if healthy_models else failed_model
    
    async def _periodic_health_checks(self):
        """Periodic health monitoring of all models"""
        while self.active:
            try:
                await asyncio.sleep(self.config.health_check_interval)
                for name, model in self.models.items():
                    await model.health_check()
                    logger.debug(f"Health check {name}: {'✓' if model.is_healthy else '✗'}")
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Health check error: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Get orchestrator status and metrics"""
        return {
            "active": self.active,
            "models": {
                name: {
                    "healthy": model.is_healthy,
                    "requests": model.request_count,
                    "errors": model.error_count,
                    "error_rate": model.error_count / max(model.request_count, 1)
                }
                for name, model in self.models.items()
            },
            "validation_status": {
                metric: self.validator.validate_performance(metric)
                for metric in self.validator.config.metrics
            }
        }

# Model factory functions
def create_model(model_name: str, model_config: Dict[str, Any]) -> BaseModel:
    """Factory function to create model adapters"""
    config = ModelConfig(
        type=model_config["type"],
        model_id=model_config["model_id"],
        capabilities=model_config["capabilities"]
    )
    
    if model_config["type"] == "anthropic_claude":
        return ClaudeAdapter(config)
    elif model_config["type"] == "openai_gpt":
        return GPTAdapter(config)
    elif model_config["type"] == "custom_llm":
        return LocalLLMAdapter(config)
    else:
        raise ValueError(f"Unknown model type: {model_config['type']}")

async def initialize_framework(artifact_data: Dict[str, Any]) -> MultiModelOrchestrator:
    """
    Main initialization function that processes the USF artifact
    and returns a ready-to-use orchestrator
    """
    logger.info(f"Initializing Universal Session Framework v{artifact_data['schema_version']}")
    
    # Validate artifact structure
    required_sections = ["model_set", "orchestration_config", "scientific_method"]
    for section in required_sections:
        if section not in artifact_data:
            raise ValueError(f"Missing required section: {section}")
    
    # Create model adapters
    models = {}
    model_weights = {}
    
    for model_name, model_config in artifact_data["model_set"]["default_models"].items():
        try:
            models[model_name] = create_model(model_name, model_config)
            # Extract weight from orchestration config if available
            weight = artifact_data["orchestration_config"]["load_balancing"].get("weights", {}).get(model_name, 1.0)
            model_weights[model_name] = weight
            logger.info(f"✓ Created {model_name} adapter ({model_config['type']})")
        except Exception as e:
            logger.error(f"Failed to create {model_name}: {e}")
    
    if not models:
        raise RuntimeError("No models could be initialized")
    
    # Create orchestration configuration
    orch_config = OrchestrationConfig(
        load_balancing_strategy=artifact_data["orchestration_config"]["load_balancing"]["strategy"],
        model_weights=model_weights,
        max_retries=artifact_data["orchestration_config"]["failover_policy"]["max_retries"],
        retry_delay_sec=artifact_data["orchestration_config"]["failover_policy"]["retry_delay_sec"]
    )
    
    # Create scientific validation configuration
    sci_config = ScientificValidationConfig(
        confidence_level=artifact_data["scientific_method"]["validation"]["confidence_level"],
        min_sample_size=artifact_data["scientific_method"]["validation"]["min_sample_size"],
        stat_tests=artifact_data["scientific_method"]["validation"]["stat_tests"],
        metrics=artifact_data["scientific_method"]["metrics"]
    )
    
    # Create validator
    validator = ScientificMethodValidator(sci_config)
    
    # Create and start orchestrator
    orchestrator = MultiModelOrchestrator(models, orch_config, validator)
    await orchestrator.start()
    
    logger.info("🚀 Universal Session Framework v2.0.0 ACTIVE")
    
    return orchestrator

# Example usage function
async def example_usage():
    """Example of how to use the framework"""
    
    # Sample USF v2.0.0 artifact (subset of your full JSON)
    sample_artifact = {
        "schema_version": "2.0.0",
        "model_set": {
            "default_models": {
                "claude_primary": {
                    "type": "anthropic_claude",
                    "model_id": "claude-latest",
                    "capabilities": ["reasoning", "coding", "analysis"]
                },
                "gpt_secondary": {
                    "type": "openai_gpt",
                    "model_id": "gpt-4",
                    "capabilities": ["reasoning", "generation", "analysis"]
                }
            }
        },
        "orchestration_config": {
            "load_balancing": {
                "strategy": "round_robin",
                "weights": {"claude_primary": 0.7, "gpt_secondary": 0.3}
            },
            "failover_policy": {
                "max_retries": 3,
                "retry_delay_sec": 2
            }
        },
        "scientific_method": {
            "validation": {
                "confidence_level": 0.95,
                "min_sample_size": 10,
                "stat_tests": ["t_test", "chi_square"]
            },
            "metrics": ["accuracy", "latency", "coherence"]
        }
    }
    
    # Initialize the framework
    orchestrator = await initialize_framework(sample_artifact)
    
    # Example usage
    result = await orchestrator.generate_response("Explain quantum computing")
    print(f"Response: {result['response']}")
    print(f"Model used: {result['model_used']}")
    print(f"Latency: {result['latency_sec']:.2f}s")
    
    # Get status
    status = orchestrator.get_status()
    print(f"System status: {status}")
    
    # Cleanup
    await orchestrator.stop()

if __name__ == "__main__":
    # This would make your elegant activation command work:
    # python -c "
    # import json, asyncio
    # with open('usf_framework_v2.json') as f:
    #     artifact = json.load(f)
    # orchestrator = asyncio.run(initialize_framework(artifact))
    # print('🚀 Universal Session Framework v2.0.0 ACTIVE')
    # "
    
    asyncio.run(example_usage())
---
#!/usr/bin/env python3
"""
Universal Session Framework (USF) v2.0.0
Complete Five-Layer Architecture Implementation

A production-ready framework for multi-model AI orchestration with embedded
scientific validation and organizational-native presentation.

Usage:
    python -c "
    import json, asyncio
    with open('usf_framework_v2.json') as f:
        artifact = json.load(f)
    orchestrator = asyncio.run(initialize_framework(artifact))
    print('🚀 Universal Session Framework v2.0.0 ACTIVE')
    "
"""

import asyncio
import json
import hashlib
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from abc import ABC, abstractmethod

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============================================================================
# USF v2.0.0 JSON Artifact Structure
# =============================================================================

USF_FRAMEWORK_V2_ARTIFACT = {
    "schema_version": "2.0.0",
    "framework_name": "Universal Session Framework",
    "creation_timestamp": "2025-08-08T00:00:00Z",
    "hash_algo": "sha256",
    "artifact_type": "multi_model_framework",
    
    "metadata": {
        "description": "Production-ready multi-model orchestration with embedded scientific validation",
        "compatibility": ["anthropic_claude", "openai_gpt", "custom_llm", "local"],
        "deployment_modes": ["cloud", "hybrid", "edge", "local"],
        "minimum_requirements": {
            "python_version": "3.8+",
            "memory_mb": 512,
            "dependencies": ["asyncio", "json", "hashlib", "random"]
        },
        "five_layer_architecture": {
            "layer_1": "Problem Definition (Structured Configuration)",
            "layer_2": "Deterministic Orchestration (Multi-Model Coordination)",
            "layer_3": "Embedded Validation (Statistical Analysis)",
            "layer_4": "Policy Enforcement (Automated Decisions)",
            "layer_5": "Presentation Abstraction (Multi-Audience Output)"
        }
    },
    
    "model_set": {
        "default_models": {
            "claude_primary": {
                "type": "anthropic_claude",
                "model_id": "claude-latest",
                "capabilities": ["reasoning", "coding", "analysis", "writing"],
                "weight": 0.5,
                "timeout_sec": 30,
                "max_retries": 3
            },
            "gpt_secondary": {
                "type": "openai_gpt",
                "model_id": "gpt-4",
                "capabilities": ["reasoning", "generation", "analysis", "creative"],
                "weight": 0.3,
                "timeout_sec": 25,
                "max_retries": 3
            },
            "local_backup": {
                "type": "custom_llm",
                "model_id": "local_llm_1",
                "capabilities": ["reasoning", "basic_analysis"],
                "weight": 0.2,
                "timeout_sec": 45,
                "max_retries": 2
            }
        }
    },
    
    "orchestration_config": {
        "load_balancing": {
            "strategy": "weighted_random",
            "weights": {
                "claude_primary": 0.5,
                "gpt_secondary": 0.3,
                "local_backup": 0.2
            }
        },
        "failover_policy": {
            "max_retries": 3,
            "retry_delay_sec": 2,
            "exponential_backoff": True
        },
        "health_monitoring": {
            "health_check_interval": 60,
            "circuit_breaker_threshold": 5,
            "circuit_breaker_cooldown_sec": 300
        },
        "concurrency": {
            "max_concurrent_requests": 10,
            "request_queue_size": 100
        }
    },
    
    "scientific_method": {
        "validation": {
            "confidence_level": 0.95,
            "min_sample_size": 15,
            "stat_tests": ["t_test", "chi_square", "anova"],
            "validation_window_hours": 24
        },
        "metrics": [
            "accuracy",
            "latency", 
            "coherence",
            "cost_efficiency",
            "user_satisfaction"
        ],
        "thresholds": {
            "min_accuracy": 0.90,
            "max_latency_sec": 2.0,
            "min_coherence": 0.85,
            "max_cost_per_request": 0.05
        }
    },
    
    "policy_engine": {
        "decision_criteria": {
            "ship_thresholds": {
                "min_success_rate": 0.95,
                "max_latency": 1.5,
                "min_sample_size": 50
            },
            "rollback_thresholds": {
                "max_error_rate": 0.15,
                "max_latency": 5.0,
                "min_success_rate": 0.70
            }
        },
        "automation_level": "full",
        "human_override": True
    },
    
    "presentation": {
        "templates": {
            "executive": {
                "format": "summary",
                "metrics": ["success_rate", "cost_summary", "decision"],
                "visualizations": ["status_dashboard", "trend_chart"]
            },
            "technical": {
                "format": "detailed",
                "metrics": ["all_metrics", "error_logs", "performance_stats"],
                "visualizations": ["detailed_metrics", "system_health"]
            },
            "operational": {
                "format": "alerts",
                "metrics": ["health_status", "error_alerts", "capacity"],
                "visualizations": ["monitoring_dashboard"]
            }
        },
        "branding": {
            "theme": "professional",
            "color_scheme": "corporate_blue",
            "logo_placement": "header",
            "custom_css_enabled": True
        }
    }
}

# =============================================================================
# Configuration Data Classes
# =============================================================================

@dataclass
class ModelConfig:
    """Configuration for individual AI models"""
    type: str
    model_id: str
    capabilities: List[str]
    weight: float = 1.0
    max_retries: int = 3
    timeout_sec: int = 30

@dataclass
class OrchestrationConfig:
    """Orchestration behavior configuration"""
    load_balancing_strategy: str = "round_robin"
    model_weights: Dict[str, float] = field(default_factory=dict)
    max_retries: int = 3
    retry_delay_sec: int = 2
    health_check_interval: int = 60
    circuit_breaker_threshold: int = 5
    circuit_breaker_cooldown_sec: int = 300

@dataclass
class ScientificValidationConfig:
    """Statistical validation requirements"""
    confidence_level: float = 0.95
    min_sample_size: int = 15
    stat_tests: List[str] = field(default_factory=lambda: ["t_test", "chi_square"])
    metrics: List[str] = field(default_factory=lambda: ["accuracy", "latency", "coherence"])
    validation_window_hours: int = 24

@dataclass
class PolicyConfig:
    """Policy engine configuration"""
    min_success_rate: float = 0.95
    max_latency: float = 1.5
    min_sample_size: int = 50
    rollback_error_threshold: float = 0.15
    automation_level: str = "full"

# =============================================================================
# Layer 1: Problem Definition (Base Model Adapters)
# =============================================================================

class BaseModel(ABC):
    """Abstract base class for AI model adapters"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.is_healthy = True
        self.request_count = 0
        self.error_count = 0
        self.consecutive_failures = 0
        self.circuit_breaker_until: Optional[datetime] = None
        self.last_success: Optional[datetime] = None
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> str:
        """Generate response from the model"""
        pass
    
    async def health_check(self) -> bool:
        """Check if model is responding correctly"""
        try:
            test_response = await asyncio.wait_for(
                self.generate_response("Health check test", is_healthcheck=True),
                timeout=5
            )
            if test_response:
                self.is_healthy = True
                self.consecutive_failures = 0
                self.last_success = datetime.now()
                return True
        except Exception as e:
            logger.warning(f"Health check failed for {self.config.model_id}: {e}")
        
        self.is_healthy = False
        self.consecutive_failures += 1
        return False
    
    def register_success(self):
        """Register successful request"""
        self.consecutive_failures = 0
        self.last_success = datetime.now()
        if self.circuit_breaker_until:
            self.circuit_breaker_until = None
            logger.info(f"Circuit breaker reset for {self.config.model_id}")
    
    def register_failure(self):
        """Register failed request"""
        self.consecutive_failures += 1
        self.error_count += 1
    
    def is_circuit_breaker_active(self) -> bool:
        """Check if circuit breaker is currently active"""
        return (self.circuit_breaker_until and 
                datetime.now() < self.circuit_breaker_until)
    
    def trip_circuit_breaker(self, cooldown_sec: int):
        """Trip the circuit breaker for this model"""
        self.circuit_breaker_until = datetime.now() + timedelta(seconds=cooldown_sec)
        self.is_healthy = False
        logger.warning(f"Circuit breaker tripped for {self.config.model_id}")

class ClaudeAdapter(BaseModel):
    """Adapter for Anthropic Claude models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        # Simulate realistic response time
        await asyncio.sleep(0.1 + random.random() * 0.2)
        
        # Don't count health checks as real requests
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        
        # Simulate occasional failures for testing
        if random.random() < 0.02:  # 2% failure rate
            raise Exception("Simulated Claude API error")
        
        return f"Claude-4 response: {prompt[:100]}..."

class GPTAdapter(BaseModel):
    """Adapter for OpenAI GPT models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.15 + random.random() * 0.25)
        
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        
        if random.random() < 0.03:  # 3% failure rate
            raise Exception("Simulated GPT API error")
        
        return f"GPT-4 response: {prompt[:100]}..."

class LocalLLMAdapter(BaseModel):
    """Adapter for local/custom LLM models"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.3 + random.random() * 0.4)
        
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        
        if random.random() < 0.05:  # 5% failure rate (less reliable)
            raise Exception("Simulated local LLM error")
        
        return f"Local-LLM response: {prompt[:100]}..."

# =============================================================================
# Layer 3: Embedded Validation (Scientific Method Validator)
# =============================================================================

class ScientificMethodValidator:
    """Statistical validation with proper scientific methods"""
    
    def __init__(self, config: ScientificValidationConfig):
        self.config = config
        self.metrics_history: Dict[str, List[Dict[str, Any]]] = {}
        self.validation_cache: Dict[str, Dict[str, Any]] = {}
    
    def record_metric(self, metric_name: str, value: float, metadata: Dict[str, Any] = None):
        """Record a metric value with timestamp and metadata"""
        if metric_name not in self.metrics_history:
            self.metrics_history[metric_name] = []
        
        entry = {
            "value": value,
            "timestamp": datetime.now(),
            "metadata": metadata or {}
        }
        self.metrics_history[metric_name].append(entry)
        
        # Clear cache for this metric
        if metric_name in self.validation_cache:
            del self.validation_cache[metric_name]
    
    def validate_performance(self, metric_name: str) -> Dict[str, Any]:
        """Perform statistical validation on recorded metrics"""
        # Check cache first
        if metric_name in self.validation_cache:
            cache_entry = self.validation_cache[metric_name]
            if (datetime.now() - cache_entry["cached_at"]).seconds < 300:  # 5min cache
                return cache_entry["result"]
        
        if metric_name not in self.metrics_history:
            return {"status": "no_data", "sample_size": 0}
        
        # Filter to validation window
        cutoff_time = datetime.now() - timedelta(hours=self.config.validation_window_hours)
        recent_entries = [
            entry for entry in self.metrics_history[metric_name]
            if entry["timestamp"] > cutoff_time
        ]
        
        values = [entry["value"] for entry in recent_entries]
        sample_size = len(values)
        
        if sample_size < self.config.min_sample_size:
            result = {
                "status": "insufficient_data",
                "sample_size": sample_size,
                "required_size": self.config.min_sample_size,
                "data_age_hours": self.config.validation_window_hours
            }
        else:
            # Statistical analysis with Bessel's correction
            mean_value = sum(values) / sample_size
            if sample_size > 1:
                variance = sum((x - mean_value) ** 2 for x in values) / (sample_size - 1)
                std_dev = variance ** 0.5
            else:
                std_dev = 0.0
            
            # Calculate confidence intervals
            t_critical = 1.96  # For 95% confidence (approximation)
            margin_error = t_critical * (std_dev / (sample_size ** 0.5))
            
            result = {
                "status": "validated",
                "sample_size": sample_size,
                "mean": mean_value,
                "std_dev": std_dev,
                "confidence_level": self.config.confidence_level,
                "confidence_interval": [mean_value - margin_error, mean_value + margin_error],
                "percentiles": {
                    "p50": sorted(values)[sample_size // 2],
                    "p95": sorted(values)[int(sample_size * 0.95)],
                    "p99": sorted(values)[int(sample_size * 0.99)] if sample_size >= 100 else None
                },
                "data_quality": self._assess_data_quality(values)
            }
        
        # Cache the result
        self.validation_cache[metric_name] = {
            "result": result,
            "cached_at": datetime.now()
        }
        
        return result
    
    def _assess_data_quality(self, values: List[float]) -> Dict[str, Any]:
        """Assess the quality and reliability of the data"""
        if not values:
            return {"quality": "no_data"}
        
        # Coefficient of variation
        mean_val = sum(values) / len(values)
        if mean_val != 0:
            cv = (sum((x - mean_val) ** 2 for x in values) / len(values)) ** 0.5 / mean_val
        else:
            cv = float('inf')
        
        # Trend analysis (simple)
        if len(values) >= 10:
            first_half = values[:len(values)//2]
            second_half = values[len(values)//2:]
            trend = sum(second_half) / len(second_half) - sum(first_half) / len(first_half)
        else:
            trend = 0
        
        quality_score = "excellent"
        if cv > 0.5:
            quality_score = "poor"
        elif cv > 0.2:
            quality_score = "fair"
        elif cv > 0.1:
            quality_score = "good"
        
        return {
            "quality": quality_score,
            "coefficient_of_variation": cv,
            "trend": trend,
            "outliers": len([v for v in values if abs(v - mean_val) > 2 * ((sum((x - mean_val) ** 2 for x in values) / len(values)) ** 0.5)])
        }

# =============================================================================
# Layer 4: Policy Enforcement (Automated Decision Engine)
# =============================================================================

class PolicyEngine:
    """Automated policy decisions with configurable thresholds"""
    
    def __init__(self, config: PolicyConfig):
        self.config = config
        self.decision_history: List[Dict[str, Any]] = []
    
    def decide(self, validator: ScientificMethodValidator) -> Dict[str, Any]:
        """Make automated deployment decision based on validation results"""
        decision_timestamp = datetime.now()
        
        # Get validation results for key metrics
        accuracy_result = validator.validate_performance("accuracy")
        latency_result = validator.validate_performance("latency")
        
        decision_data = {
            "timestamp": decision_timestamp,
            "accuracy_validation": accuracy_result,
            "latency_validation": latency_result,
            "decision_criteria": {
                "min_success_rate": self.config.min_success_rate,
                "max_latency": self.config.max_latency,
                "min_sample_size": self.config.min_sample_size
            }
        }
        
        # Check if we have enough data
        if (accuracy_result.get("status") != "validated" or 
            latency_result.get("status") != "validated"):
            decision = "ITERATE"
            reason = "Insufficient validation data"
            confidence = 0.0
        else:
            # Extract metrics
            accuracy_mean = accuracy_result["mean"]
            latency_mean = latency_result["mean"]
            sample_size = min(accuracy_result["sample_size"], latency_result["sample_size"])
            
            # Decision logic
            if sample_size < self.config.min_sample_size:
                decision = "ITERATE"
                reason = f"Sample size {sample_size} below minimum {self.config.min_sample_size}"
                confidence = 0.3
            elif (accuracy_mean >= self.config.min_success_rate and 
                  latency_mean <= self.config.max_latency):
                decision = "SHIP"
                reason = f"Performance meets thresholds: {accuracy_mean:.3f} accuracy, {latency_mean:.3f}s latency"
                confidence = 0.9
            elif accuracy_mean < (self.config.min_success_rate * 0.8):
                decision = "ROLLBACK"
                reason = f"Accuracy {accuracy_mean:.3f} critically below threshold"
                confidence = 0.95
            else:
                decision = "ITERATE"
                reason = f"Performance below thresholds: {accuracy_mean:.3f} accuracy, {latency_mean:.3f}s latency"
                confidence = 0.7
        
        decision_result = {
            "decision": decision,
            "reason": reason,
            "confidence": confidence,
            "timestamp": decision_timestamp.isoformat(),
            "validation_data": decision_data,
            "automated": self.config.automation_level == "full"
        }
        
        # Store decision history
        self.decision_history.append(decision_result)
        
        logger.info(f"🎯 Policy Decision: {decision} (confidence: {confidence:.1%}) - {reason}")
        
        return decision_result

# =============================================================================
# Layer 5: Presentation Abstraction (Multi-Audience Reports)
# =============================================================================

class PresentationEngine:
    """Generate multi-audience reports and dashboards"""
    
    def __init__(self, presentation_config: Dict[str, Any]):
        self.config = presentation_config
        self.templates = presentation_config.get("templates", {})
        self.branding = presentation_config.get("branding", {})
    
    def generate_executive_report(self, orchestrator: 'MultiModelOrchestrator', 
                                decision_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive-level summary report"""
        status = orchestrator.get_status()
        
        # Calculate high-level metrics
        total_requests = sum(model_stats["requests"] for model_stats in status["models"].values())
        total_errors = sum(model_stats["errors"] for model_stats in status["models"].values())
        overall_success_rate = (total_requests - total_errors) / max(total_requests, 1)
        
        # Cost estimation (simplified)
        estimated_cost = total_requests * 0.01  # $0.01 per request estimate
        
        return {
            "report_type": "executive_summary",
            "timestamp": datetime.now().isoformat(),
            "status_overview": {
                "system_health": "healthy" if orchestrator.active else "inactive",
                "decision": decision_result["decision"],
                "confidence": f"{decision_result['confidence']:.0%}",
                "recommendation": self._get_executive_recommendation(decision_result)
            },
            "key_metrics": {
                "success_rate": f"{overall_success_rate:.1%}",
                "total_requests": total_requests,
                "estimated_cost": f"${estimated_cost:.2f}",
                "active_models": len([m for m in status["models"].values() if m["healthy"]])
            },
            "summary": f"System processed {total_requests} requests with {overall_success_rate:.1%} success rate. Recommendation: {decision_result['decision']}.",
            "next_actions": self._get_next_actions(decision_result),
            "branding": self.branding
        }
    
    def generate_technical_report(self, orchestrator: 'MultiModelOrchestrator',
                                decision_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed technical report"""
        status = orchestrator.get_status()
        
        return {
            "report_type": "technical_details",
            "timestamp": datetime.now().isoformat(),
            "system_status": status,
            "decision_analysis": decision_result,
            "model_performance": {
                name: {
                    **model_stats,
                    "uptime_percentage": self._calculate_uptime(name, orchestrator),
                    "avg_response_time": self._get_avg_response_time(name, orchestrator)
                }
                for name, model_stats in status["models"].items()
            },
            "validation_details": status["validation_status"],
            "recommendations": self._get_technical_recommendations(status, decision_result),
            "monitoring_alerts": self._get_active_alerts(orchestrator)
        }
    
    def generate_operational_report(self, orchestrator: 'MultiModelOrchestrator') -> Dict[str, Any]:
        """Generate operational monitoring report"""
        status = orchestrator.get_status()
        
        alerts = []
        for name, model_stats in status["models"].items():
            if not model_stats["healthy"]:
                alerts.append(f"Model {name} is unhealthy")
            if model_stats["error_rate"] > 0.1:
                alerts.append(f"Model {name} has high error rate: {model_stats['error_rate']:.1%}")
        
        return {
            "report_type": "operational_monitoring",
            "timestamp": datetime.now().isoformat(),
            "health_status": "healthy" if len(alerts) == 0 else "degraded",
            "active_alerts": alerts,
            "capacity_status": {
                "active_models": len([m for m in status["models"].values() if m["healthy"]]),
                "total_models": len(status["models"]),
                "load_distribution": self._get_load_distribution(status)
            },
            "performance_summary": {
                "total_requests": sum(m["requests"] for m in status["models"].values()),
                "error_rate": sum(m["errors"] for m in status["models"].values()) / max(sum(m["requests"] for m in status["models"].values()), 1),
                "health_score": len([m for m in status["models"].values() if m["healthy"]]) / len(status["models"])
            }
        }
    
    def _get_executive_recommendation(self, decision_result: Dict[str, Any]) -> str:
        """Get executive-friendly recommendation"""
        decision = decision_result["decision"]
        if decision == "SHIP":
            return "System performing well - ready for production deployment"
        elif decision == "ROLLBACK":
            return "Critical issues detected - immediate rollback recommended"
        else:
            return "System requires optimization before deployment"
    
    def _get_next_actions(self, decision_result: Dict[str, Any]) -> List[str]:
        """Get actionable next steps"""
        decision = decision_result["decision"]
        if decision == "SHIP":
            return ["Proceed with deployment", "Monitor post-deployment metrics", "Prepare scaling plan"]
        elif decision == "ROLLBACK":
            return ["Initiate rollback procedure", "Investigate root cause", "Implement fixes"]
        else:
            return ["Continue optimization", "Increase sample size", "Review performance metrics"]
    
    def _get_technical_recommendations(self, status: Dict[str, Any], 
                                     decision_result: Dict[str, Any]) -> List[str]:
        """Get technical recommendations"""
        recommendations = []
        
        for name, model_stats in status["models"].items():
            if model_stats["error_rate"] > 0.05:
                recommendations.append(f"Investigate high error rate for {name}")
            if not model_stats["healthy"]:
                recommendations.append(f"Restore {name} model to healthy state")
        
        if decision_result["confidence"] < 0.7:
            recommendations.append("Increase sample size for more confident decisions")
        
        return recommendations
    
    def _calculate_uptime(self, model_name: str, orchestrator: 'MultiModelOrchestrator') -> float:
        """Calculate model uptime percentage (simplified)"""
        return 0.99 if orchestrator.models[model_name].is_healthy else 0.85
    
    def _get_avg_response_time(self, model_name: str, orchestrator: 'MultiModelOrchestrator') -> float:
        """Get average response time for model (simplified)"""
        # In production, this would come from actual metrics
        base_times = {"claude_primary": 0.8, "gpt_secondary": 1.2, "local_backup": 2.1}
        return base_times.get(model_name, 1.0)
    
    def _get_active_alerts(self, orchestrator: 'MultiModelOrchestrator') -> List[Dict[str, Any]]:
        """Get active system alerts"""
        alerts = []
        for name, model in orchestrator.models.items():
            if model.consecutive_failures > 3:
                alerts.append({
                    "severity": "warning",
                    "component": name,
                    "message": f"Model has {model.consecutive_failures} consecutive failures"
                })
            if model.is_circuit_breaker_active():
                alerts.append({
                    "severity": "critical",
                    "component": name,
                    "message": "Circuit breaker is active"
                })
        return alerts
    
    def _get_load_distribution(self, status: Dict[str, Any]) -> Dict[str, float]:
        """Get load distribution across models"""
        total_requests = sum(m["requests"] for m in status["models"].values())
        if total_requests == 0:
            return {name: 0.0 for name in status["models"]}
        
        return {
            name: model_stats["requests"] / total_requests
            for name, model_stats in status["models"].items()
        }

# =============================================================================
# Layer 2: Deterministic Orchestration (Main Orchestrator)
# =============================================================================

class MultiModelOrchestrator:
    """Production-grade multi-model orchestrator with full Five-Layer Architecture"""
    
    def __init__(self, 
                 models: Dict[str, BaseModel],
                 orchestration_config: OrchestrationConfig,
                 validator: ScientificMethodValidator,
                 policy_engine: PolicyEngine,
                 presentation_engine: PresentationEngine,
                 artifact_hash: Optional[str] = None):
        self.models = models
        self.config = orchestration_config
        self.validator = validator
        self.policy_engine = policy_engine
        self.presentation_engine = presentation_engine
        
        self.current_model_index = 0
        self.active = False
        self.health_check_task: Optional[asyncio.Task] = None
        self._select_lock = asyncio.Lock()
        self.artifact_hash = artifact_hash
        
        # Request tracking
        self.request_queue = asyncio.Queue(maxsize=100)
        self.active_requests = 0
        self.max_concurrent_requests = 10
    
    async def start(self):
        """Initialize and start the orchestrator"""
        if self.active:
            logger.info("Orchestrator already active")
            return
            
        logger.info("Starting Universal Session Framework v2.0.0...")
        
        # Initial health checks
        healthy_models = []
        for name, model in self.models.items():
            if await model.health_check():
                healthy_models.append(name)
                logger.info(f"✓ {name} model healthy")
            else:
                logger.warning(f"✗ {name} model unhealthy")
        
        if not healthy_models:
            raise RuntimeError("No healthy models available")
        
        self.active = True
        
        # Start background tasks
        self.health_check_task = asyncio.create_task(self._periodic_health_checks())
        
        logger.info(f"🚀 Universal Session Framework v2.0.0 ACTIVE")
        logger.info(f"   - Active models: {len(healthy_models)}")
        logger.info(f"   - Load balancing: {self.config.load_balancing_strategy}")
        logger.info(f"   - Artifact hash: {self.artifact_hash[:16] if self.artifact_hash else 'N/A'}...")
        
    async def stop(self):
        """Gracefully stop the orchestrator"""
        if not self.active:
            logger.info("Orchestrator already stopped")
            return
            
        logger.info("Stopping Universal Session Framework...")
        self.active = False
        
        # Cancel background tasks
        if self.health_check_task:
            self.health_check_task.cancel()
            try:
                await self.health_check_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Universal Session Framework stopped")
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response with full orchestration pipeline"""
        if not self.active:
            raise RuntimeError("Orchestrator not active")
        
        # Concurrency control
        if self.active_requests >= self.max_concurrent_requests:
            return {
                "response": None,
                "error": "System at capacity - request rejected",
                "status": "rejected",
                "active_requests": self.active_requests
            }
        
        self.active_requests += 1
        start_time = datetime.now()
        
        try:
            # Model selection and retry logic
            selected_model = await self._select_model()
            last_error = None
            
            for attempt in range(self.config.max_retries):
                try:
                    # Generate response with timeout
                    response = await asyncio.wait_for(
                        selected_model.generate_response(prompt, **kwargs),
                        timeout=selected_model.config.timeout_sec
                    )
                    
                    # Success metrics
                    latency = (datetime.now() - start_time).total_seconds()
                    self.validator.record_metric("accuracy", 1.0, {"model": selected_model.config.model_id})
                    self.validator.record_metric("latency", latency, {"model": selected_model.config.model_id})
                    
                    # Simulate coherence scoring (in production, this would be more sophisticated)
                    coherence_score = 0.85 + random.random() * 0.14  # 0.85-0.99
                    self.validator.record_metric("coherence", coherence_score, {"model": selected_model.config.model_id})
                    
                    selected_model.register_success()
                    
                    return {
                        "response": response,
                        "model_used": selected_model.config.model_id,
                        "latency_sec": latency,
                        "attempt": attempt + 1,
                        "status": "success",
                        "coherence_score": coherence_score
                    }
                    
                except Exception as e:
                    last_error = e
                    logger.warning(f"Attempt {attempt + 1} failed on {selected_model.config.model_id}: {e}")
                    
                    selected_model.register_failure()
                    self.validator.record_metric("accuracy", 0.0, {"model": selected_model.config.model_id, "error": str(e)})
                    
                    # Circuit breaker logic
                    if selected_model.consecutive_failures >= self.config.circuit_breaker_threshold:
                        selected_model.trip_circuit_breaker(self.config.circuit_breaker_cooldown_sec)
                    
                    # Try fallback model
                    if attempt < self.config.max_retries - 1:
                        await asyncio.sleep(self.config.retry_delay_sec * (2 ** attempt))  # Exponential backoff
                        fallback_model = await self._select_fallback_model(selected_model)
                        if fallback_model != selected_model:
                            selected_model = fallback_model
            
            # All attempts failed
            total_time = (datetime.now() - start_time).total_seconds()
            return {
                "response": None,
                "error": f"All attempts failed: {last_error}",
                "latency_sec": total_time,
                "attempts": self.config.max_retries,
                "status": "failed"
            }
            
        finally:
            self.active_requests -= 1
    
    async def _select_model(self) -> BaseModel:
        """Select model with load balancing and circuit breaker awareness"""
        async with self._select_lock:
            # Filter healthy models (not in circuit breaker state)
            available_models = [
                (name, model) for name, model in self.models.items()
                if model.is_healthy and not model.is_circuit_breaker_active()
            ]
            
            if not available_models:
                # Fallback to any healthy model
                available_models = [(name, model) for name, model in self.models.items() if model.is_healthy]
                
            if not available_models:
                raise RuntimeError("No healthy models available")
            
            strategy = self.config.load_balancing_strategy.lower()
            if strategy in ("weighted", "weighted_random"):
                names, models = zip(*available_models)
                weights = [self.config.model_weights.get(name, 1.0) for name in names]
                return random.choices(models, weights=weights, k=1)[0]
            else:
                # Round robin
                _, model = available_models[self.current_model_index % len(available_models)]
                self.current_model_index += 1
                return model
    
    async def _select_fallback_model(self, failed_model: BaseModel) -> BaseModel:
        """Select fallback model avoiding the failed one"""
        async with self._select_lock:
            available_models = [
                model for model in self.models.values()
                if (model.is_healthy and 
                    not model.is_circuit_breaker_active() and 
                    model != failed_model)
            ]
            
            if not available_models:
                # No better option available
                return failed_model
            
            # Select highest weighted available model
            best_model = available_models[0]
            best_weight = 0
            
            for model in available_models:
                weight = self.config.model_weights.get(model.config.model_id, 1.0)
                if weight > best_weight:
                    best_weight = weight
                    best_model = model
            
            return best_model
    
    async def _periodic_health_checks(self):
        """Periodic health monitoring with circuit breaker recovery"""
        while self.active:
            try:
                await asyncio.sleep(self.config.health_check_interval)
                
                for name, model in self.models.items():
                    # Regular health check
                    await model.health_check()
                    
                    # Circuit breaker recovery check
                    if (model.is_circuit_breaker_active() and 
                        model.circuit_breaker_until and 
                        datetime.now() >= model.circuit_breaker_until):
                        logger.info(f"Testing circuit breaker recovery for {name}")
                        if await model.health_check():
                            model.circuit_breaker_until = None
                            logger.info(f"Circuit breaker recovered for {name}")
                    
                    logger.debug(f"Health check {name}: {'✓' if model.is_healthy else '✗'}")
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Health check error: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Get comprehensive orchestrator status"""
        return {
            "active": self.active,
            "framework_version": "2.0.0",
            "artifact_hash": self.artifact_hash,
            "active_requests": self.active_requests,
            "max_concurrent_requests": self.max_concurrent_requests,
            "models": {
                name: {
                    "healthy": model.is_healthy,
                    "requests": model.request_count,
                    "errors": model.error_count,
                    "error_rate": model.error_count / max(model.request_count, 1),
                    "consecutive_failures": model.consecutive_failures,
                    "circuit_breaker_active": model.is_circuit_breaker_active(),
                    "last_success": model.last_success.isoformat() if model.last_success else None
                }
                for name, model in self.models.items()
            },
            "validation_status": {
                metric: self.validator.validate_performance(metric)
                for metric in self.validator.config.metrics
            },
            "policy_decisions": len(self.policy_engine.decision_history),
            "load_balancing_strategy": self.config.load_balancing_strategy
        }
    
    async def get_policy_decision(self) -> Dict[str, Any]:
        """Get current policy decision"""
        return self.policy_engine.decide(self.validator)
    
    def get_executive_report(self) -> Dict[str, Any]:
        """Generate executive report"""
        decision_result = self.policy_engine.decide(self.validator)
        return self.presentation_engine.generate_executive_report(self, decision_result)
    
    def get_technical_report(self) -> Dict[str, Any]:
        """Generate technical report"""
        decision_result = self.policy_engine.decide(self.validator)
        return self.presentation_engine.generate_technical_report(self, decision_result)
    
    def get_operational_report(self) -> Dict[str, Any]:
        """Generate operational report"""
        return self.presentation_engine.generate_operational_report(self)

# =============================================================================
# Framework Initialization and Factory Functions
# =============================================================================

def sha256_json(obj: Any) -> str:
    """Generate SHA256 hash for artifact integrity verification"""
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()

def create_model(model_name: str, model_config: Dict[str, Any]) -> BaseModel:
    """Factory function to create model adapters"""
    config = ModelConfig(
        type=model_config["type"],
        model_id=model_config["model_id"],
        capabilities=model_config["capabilities"],
        weight=model_config.get("weight", 1.0),
        max_retries=model_config.get("max_retries", 3),
        timeout_sec=model_config.get("timeout_sec", 30)
    )
    
    model_type = model_config["type"].lower()
    if model_type == "anthropic_claude":
        return ClaudeAdapter(config)
    elif model_type == "openai_gpt":
        return GPTAdapter(config)
    elif model_type == "custom_llm":
        return LocalLLMAdapter(config)
    else:
        raise ValueError(f"Unknown model type: {model_config['type']}")

async def initialize_framework(artifact_data: Dict[str, Any]) -> MultiModelOrchestrator:
    """
    Complete Five-Layer Architecture initialization
    
    Layer 1: Problem Definition (Configuration validation)
    Layer 2: Deterministic Orchestration (Model coordination)
    Layer 3: Embedded Validation (Statistical analysis)
    Layer 4: Policy Enforcement (Automated decisions)
    Layer 5: Presentation Abstraction (Multi-audience outputs)
    """
    logger.info("=" * 60)
    logger.info("Initializing Universal Session Framework v2.0.0")
    logger.info("Five-Layer Architecture Implementation")
    logger.info("=" * 60)
    
    # Artifact integrity verification
    artifact_hash = sha256_json(artifact_data)
    logger.info(f"Artifact integrity hash: {artifact_hash}")
    
    # Layer 1: Problem Definition - Validate configuration structure
    required_sections = ["model_set", "orchestration_config", "scientific_method"]
    for section in required_sections:
        if section not in artifact_data:
            raise ValueError(f"Missing required section: {section}")
    
    logger.info("✓ Layer 1: Problem Definition validated")
    
    # Create model adapters
    models: Dict[str, BaseModel] = {}
    model_weights: Dict[str, float] = {}
    
    for model_name, model_config in artifact_data["model_set"]["default_models"].items():
        try:
            models[model_name] = create_model(model_name, model_config)
            weight = (
                artifact_data["orchestration_config"]
                .get("load_balancing", {})
                .get("weights", {})
                .get(model_name, model_config.get("weight", 1.0))
            )
            model_weights[model_name] = weight
            logger.info(f"✓ Created {model_name} adapter ({model_config['type']}, weight: {weight})")
        except Exception as e:
            logger.error(f"Failed to create {model_name}: {e}")
    
    if not models:
        raise RuntimeError("No models could be initialized")
    
    # Layer 2: Deterministic Orchestration Configuration
    orch_cfg = artifact_data["orchestration_config"]
    orchestration_config = OrchestrationConfig(
        load_balancing_strategy=orch_cfg["load_balancing"]["strategy"],
        model_weights=model_weights,
        max_retries=orch_cfg["failover_policy"]["max_retries"],
        retry_delay_sec=orch_cfg["failover_policy"]["retry_delay_sec"],
        health_check_interval=orch_cfg.get("health_monitoring", {}).get("health_check_interval", 60),
        circuit_breaker_threshold=orch_cfg.get("health_monitoring", {}).get("circuit_breaker_threshold", 5),
        circuit_breaker_cooldown_sec=orch_cfg.get("health_monitoring", {}).get("circuit_breaker_cooldown_sec", 300)
    )
    logger.info("✓ Layer 2: Deterministic Orchestration configured")
    
    # Layer 3: Embedded Validation Configuration
    sci_cfg = artifact_data["scientific_method"]
    validation_config = ScientificValidationConfig(
        confidence_level=sci_cfg["validation"]["confidence_level"],
        min_sample_size=sci_cfg["validation"]["min_sample_size"],
        stat_tests=sci_cfg["validation"]["stat_tests"],
        metrics=sci_cfg["metrics"],
        validation_window_hours=sci_cfg["validation"].get("validation_window_hours", 24)
    )
    validator = ScientificMethodValidator(validation_config)
    logger.info("✓ Layer 3: Embedded Validation initialized")
    
    # Layer 4: Policy Enforcement Configuration
    policy_cfg = artifact_data.get("policy_engine", {})
    policy_config = PolicyConfig(
        min_success_rate=policy_cfg.get("decision_criteria", {}).get("ship_thresholds", {}).get("min_success_rate", 0.95),
        max_latency=policy_cfg.get("decision_criteria", {}).get("ship_thresholds", {}).get("max_latency", 1.5),
        min_sample_size=policy_cfg.get("decision_criteria", {}).get("ship_thresholds", {}).get("min_sample_size", 50),
        rollback_error_threshold=policy_cfg.get("decision_criteria", {}).get("rollback_thresholds", {}).get("max_error_rate", 0.15),
        automation_level=policy_cfg.get("automation_level", "full")
    )
    policy_engine = PolicyEngine(policy_config)
    logger.info("✓ Layer 4: Policy Enforcement configured")
    
    # Layer 5: Presentation Abstraction Configuration
    presentation_config = artifact_data.get("presentation", {})
    presentation_engine = PresentationEngine(presentation_config)
    logger.info("✓ Layer 5: Presentation Abstraction initialized")
    
    # Create and start orchestrator
    orchestrator = MultiModelOrchestrator(
        models=models,
        orchestration_config=orchestration_config,
        validator=validator,
        policy_engine=policy_engine,
        presentation_engine=presentation_engine,
        artifact_hash=artifact_hash
    )
    
    await orchestrator.start()
    
    logger.info("=" * 60)
    logger.info("🚀 Universal Session Framework v2.0.0 ACTIVE")
    logger.info("All Five Layers Operational")
    logger.info("=" * 60)
    
    return orchestrator

# =============================================================================
# Usage Examples and Testing
# =============================================================================

async def demonstration_suite():
    """Complete demonstration of all Five Layers"""
    
    print("\n" + "=" * 80)
    print("UNIVERSAL SESSION FRAMEWORK v2.0.0 DEMONSTRATION")
    print("Five-Layer Architecture in Action")
    print("=" * 80)
    
    # Initialize with the complete artifact
    orchestrator = await initialize_framework(USF_FRAMEWORK_V2_ARTIFACT)
    
    print("\n📊 Running demonstration requests...")
    
    # Generate sample requests to build metrics
    test_prompts = [
        "Explain quantum computing principles",
        "Write a Python function for binary search",
        "Analyze market trends in renewable energy",
        "Design a microservices architecture",
        "Optimize database query performance",
        "Create a machine learning pipeline",
        "Implement OAuth 2.0 authentication",
        "Plan a cloud migration strategy",
        "Debug concurrent programming issues",
        "Design a REST API specification"
    ]
    
    results = []
    for i, prompt in enumerate(test_prompts * 2):  # Run twice to get more metrics
        try:
            result = await orchestrator.generate_response(f"{prompt} (request {i+1})")
            results.append(result)
            if i % 5 == 0:
                print(f"  Processed {i+1}/20 requests...")
        except Exception as e:
            print(f"  Error on request {i+1}: {e}")
    
    print("✓ Sample requests completed")
    
    # Layer 4: Get Policy Decision
    print("\n🎯 Layer 4: Policy Engine Decision")
    policy_decision = await orchestrator.get_policy_decision()
    print(f"Decision: {policy_decision['decision']}")
    print(f"Reason: {policy_decision['reason']}")
    print(f"Confidence: {policy_decision['confidence']:.1%}")
    
    # Layer 5: Generate Reports
    print("\n📋 Layer 5: Multi-Audience Reports")
    
    print("\n--- EXECUTIVE REPORT ---")
    exec_report = orchestrator.get_executive_report()
    print(f"Status: {exec_report['status_overview']['system_health']}")
    print(f"Decision: {exec_report['status_overview']['decision']}")
    print(f"Success Rate: {exec_report['key_metrics']['success_rate']}")
    print(f"Total Requests: {exec_report['key_metrics']['total_requests']}")
    print(f"Summary: {exec_report['summary']}")
    
    print("\n--- TECHNICAL REPORT ---")
    tech_report = orchestrator.get_technical_report()
    print("Model Performance:")
    for model_name, stats in tech_report['model_performance'].items():
        print(f"  {model_name}: {stats['requests']} requests, {stats['error_rate']:.1%} error rate")
    
    print("\n--- OPERATIONAL REPORT ---")
    ops_report = orchestrator.get_operational_report()
    print(f"Health Status: {ops_report['health_status']}")
    print(f"Active Alerts: {len(ops_report['active_alerts'])}")
    print(f"Health Score: {ops_report['performance_summary']['health_score']:.1%}")
    
    # System status
    print("\n🔍 System Status Summary")
    status = orchestrator.get_status()
    print(f"Framework Version: {status['framework_version']}")
    print(f"Active Requests: {status['active_requests']}")
    print(f"Load Balancing: {status['load_balancing_strategy']}")
    print(f"Policy Decisions Made: {status['policy_decisions']}")
    
    print("\n📈 Validation Results")
    for metric, result in status['validation_status'].items():
        if result['status'] == 'validated':
            print(f"  {metric}: {result['mean']:.3f} (±{result['std_dev']:.3f})")
        else:
            print(f"  {metric}: {result['status']} ({result.get('sample_size', 0)} samples)")
    
    # Cleanup
    await orchestrator.stop()
    
    print("\n✅ Universal Session Framework v2.0.0 Demonstration Complete")
    print("All Five Layers Successfully Demonstrated")
    print("=" * 80)

async def simple_usage_example():
    """Simple usage example for the elegant activation pattern"""
    
    # This demonstrates the elegant one-line activation:
    # python -c "import json, asyncio; artifact=json.load(open('usf_framework_v2.json')); asyncio.run(initialize_framework(artifact))"
    
    orchestrator = await initialize_framework(USF_FRAMEWORK_V2_ARTIFACT)
    
    # Simple request
    result = await orchestrator.generate_response("Hello, world!")
    print(f"Response: {result['response']}")
    print(f"Model: {result['model_used']}")
    print(f"Latency: {result['latency_sec']:.3f}s")
    
    # Get quick status
    decision = await orchestrator.get_policy_decision()
    print(f"System Decision: {decision['decision']}")
    
    await orchestrator.stop()

def save_artifact_to_file(filename: str = "usf_framework_v2.json"):
    """Save the complete framework artifact to a JSON file"""
    with open(filename, 'w') as f:
        json.dump(USF_FRAMEWORK_V2_ARTIFACT, f, indent=2)
    print(f"✓ Framework artifact saved to {filename}")
    print("Now you can use the elegant activation pattern:")
    print("python -c \"import json, asyncio; from usf_complete_framework import initialize_framework; artifact=json.load(open('usf_framework_v2.json')); asyncio.run(initialize_framework(artifact))\"")

if __name__ == "__main__":
    # Save the artifact file for standalone usage
    save_artifact_to_file()
    
    # Run the complete demonstration
    asyncio.run(demonstration_suite())

---

#!/usr/bin/env python3
"""
Complete Content Processing Ecosystem
=====================================

Combining Universal Session Framework v2.0.0 with Offline HTML Chunker
for end-to-end content intelligence processing.

Components:
- HTML Chunker: Intelligent preprocessing of HTML documents → JSONL chunks
- USF v2.0.0: Multi-model AI orchestration with Five-Layer Architecture
- Integration Pipeline: Complete document → intelligence workflow

Usage Pipeline:
    1. Chunk HTML documents: python pipeline.py chunk -i docs/ -o chunks/
    2. Process with USF: python pipeline.py process -i chunks/ -o results/ --concurrency 8
    3. Generate reports: python pipeline.py report -i results/
    4. Run full demo: python pipeline.py demo --concurrency 3

Architecture:
    HTML Docs → [Chunker] → JSONL → [USF] → Validated Intelligence → Reports
"""

import asyncio
import json
import logging
import argparse
import hashlib
import math
import re
import statistics
import sys
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, field, asdict
from abc import ABC, abstractmethod
from html import unescape
from html.parser import HTMLParser

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============================================================================
# PART 1: HTML CHUNKER (Content Preprocessing)
# =============================================================================

# Optional BeautifulSoup import
try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

def est_tokens_from_text(text: str) -> int:
    """Rough heuristic: ~4 chars per token"""
    return max(1, math.ceil(len(text) / 4))

def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def sha256_json(obj: Any) -> str:
    """Generate SHA256 hash of JSON object for reproducibility"""
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()

def sanitize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def percentile(vals: List[int], p: float) -> float:
    """Calculate percentile with proper interpolation"""
    if not vals:
        return 0.0
    vals_sorted = sorted(vals)
    k = (len(vals_sorted) - 1) * (p / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return float(vals_sorted[int(k)])
    d0 = vals_sorted[int(f)] * (c - k)
    d1 = vals_sorted[int(c)] * (k - f)
    return float(d0 + d1)

def split_sentences(text: str) -> List[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p]

# Boilerplate detection patterns
NAV_CLASSES = re.compile(r"(nav|menu|breadcrumb|sidebar|sidenav|drawer|tabs?)", re.I)
FOOTER_CLASSES = re.compile(r"(footer|copyright|legal)", re.I)
AD_CLASSES = re.compile(r"(ad-|ads|advert|promo|sponsor)", re.I)

def _looks_boilerplate(tag) -> bool:
    name = getattr(tag, "name", "").lower()
    if name in {"script", "style", "noscript", "svg", "nav", "aside", "footer"}:
        return True
    if hasattr(tag, "get"):
        class_str = " ".join(tag.get("class", []))
        ident = tag.get("id", "")
        blob = f"{class_str} {ident}"
        if any(pattern.search(blob) for pattern in [NAV_CLASSES, FOOTER_CLASSES, AD_CLASSES]):
            return True
    return False

@dataclass
class Section:
    headings: List[tuple]  # (level, text)
    blocks: List[str]      # paragraph-like strings

@dataclass
class Chunk:
    doc_id: str
    chunk_id: str
    headings: List[str]
    text: str
    est_tokens: int
    source_path: str
    hash16: str

def parse_html_to_sections(html: str) -> List[Section]:
    """Extract sections from HTML, preserving heading hierarchy"""
    if BeautifulSoup:
        soup = BeautifulSoup(html, "html.parser")
        
        # Remove boilerplate
        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()
        
        for tag in list(soup.find_all(True)):
            if _looks_boilerplate(tag) and tag.name not in {"html", "body"}:
                try:
                    tag.decompose()
                except:
                    pass
        
        # Extract blocks
        blocks = []
        for el in soup.find_all(True):
            name = el.name.lower()
            if re.fullmatch(r"h[1-6]", name):
                text = sanitize_ws(el.get_text(" ", strip=True))
                if text:
                    blocks.append({"type": "heading", "level": int(name[1]), "text": text})
            elif name in {"p", "li", "pre", "code"}:  # Restrict to specific text containers
                text = sanitize_ws(el.get_text(" ", strip=True))
                if text and len(text) > 20:  # Filter very short text
                    blocks.append({"type": "text", "text": text})
    else:
        # Fallback simple extraction
        blocks = []
        lines = html.split('\n')
        for line in lines:
            clean = sanitize_ws(re.sub(r'<[^>]+>', '', line))
            if clean and len(clean) > 20:
                blocks.append({"type": "text", "text": clean})
    
    # Convert to sections
    sections = []
    cur_headings = []
    cur_blocks = []
    
    def push_section():
        if cur_blocks:
            sections.append(Section(headings=list(cur_headings), blocks=list(cur_blocks)))
    
    for b in blocks:
        if b["type"] == "heading":
            push_section()
            lvl = b.get("level", 2)
            txt = b.get("text", "")
            cur_headings = [h for h in cur_headings if h[0] < lvl]
            cur_headings.append((lvl, txt))
            cur_blocks = []
        else:
            cur_blocks.append(b["text"])
    
    push_section()
    return [s for s in sections if " ".join(s.blocks).strip()]

def build_chunks_for_sections(sections: List[Section], doc_id: str, source_path: Path,
                             target_tokens: int = 800, overlap_tokens: int = 120) -> List[Chunk]:
    """Build overlapping chunks from sections"""
    chunks = []
    carryover = ""
    
    for sec in sections:
        heading_path = [t for _, t in sec.headings]
        para_queue = list(sec.blocks)
        buf = carryover
        
        while para_queue:
            candidate = sanitize_ws((buf + " " + para_queue[0]).strip())
            if est_tokens_from_text(candidate) <= target_tokens or not buf:
                buf = candidate
                para_queue.pop(0)
            else:
                if buf.strip():
                    chunks.append(make_chunk(doc_id, len(chunks), heading_path, buf.strip(), source_path))
                buf = ""
        
        if buf.strip():
            chunks.append(make_chunk(doc_id, len(chunks), heading_path, buf.strip(), source_path))
        
        # Prepare overlap for next section
        carryover = ""
        if chunks:
            tail = chunks[-1].text
            sentences = split_sentences(tail)
            acc = []
            count = 0
            for sent in reversed(sentences):
                t = est_tokens_from_text(sent)
                if count + t > overlap_tokens:
                    break
                acc.append(sent)
                count += t
            carryover = " ".join(reversed(acc))
    
    return chunks

def make_chunk(doc_id: str, idx: int, headings: List[str], text: str, source_path: Path) -> Chunk:
    hash16 = sha256_text(text)[:16]
    return Chunk(
        doc_id=doc_id,
        chunk_id=f"{doc_id}_{hash16}",  # Stable hash-based ID
        headings=headings[-3:],  # last 3 headings
        text=text,
        est_tokens=est_tokens_from_text(text),
        source_path=str(source_path),
        hash16=hash16
    )

def process_html_file(path: Path, out_dir: Path, target_tokens: int, overlap_tokens: int) -> List[Chunk]:
    """Process single HTML file into chunks"""
    html = path.read_text(encoding="utf-8", errors="ignore")
    sections = parse_html_to_sections(html)
    doc_id = path.stem
    chunks = build_chunks_for_sections(sections, doc_id=doc_id, source_path=path,
                                     target_tokens=target_tokens, overlap_tokens=overlap_tokens)
    
    # Write JSONL output
    out_path = out_dir / f"{path.stem}.jsonl"
    with out_path.open("w", encoding="utf-8") as f:
        for c in chunks:
            f.write(json.dumps(asdict(c), ensure_ascii=False) + "\n")
    
    return chunks

# =============================================================================
# PART 2: UNIVERSAL SESSION FRAMEWORK v2.0.0 (AI Orchestration)
# =============================================================================

# Configuration Classes
@dataclass
class ModelConfig:
    type: str
    model_id: str
    capabilities: List[str]
    weight: float = 1.0
    max_retries: int = 3
    timeout_sec: int = 30

@dataclass
class OrchestrationConfig:
    load_balancing_strategy: str = "weighted_random"
    model_weights: Dict[str, float] = field(default_factory=dict)
    max_retries: int = 3
    retry_delay_sec: int = 2
    health_check_interval: int = 60
    circuit_breaker_threshold: int = 5
    circuit_breaker_cooldown_sec: int = 300

@dataclass
class ScientificValidationConfig:
    confidence_level: float = 0.95
    min_sample_size: int = 15
    stat_tests: List[str] = field(default_factory=lambda: ["t_test", "chi_square"])
    metrics: List[str] = field(default_factory=lambda: ["accuracy", "latency", "coherence"])
    validation_window_hours: int = 24

@dataclass
class PolicyConfig:
    min_success_rate: float = 0.95
    max_latency: float = 1.5
    min_sample_size: int = 50
    rollback_error_threshold: float = 0.15
    automation_level: str = "full"

# Model Adapters (Layer 1: Problem Definition)
class BaseModel(ABC):
    def __init__(self, config: ModelConfig):
        self.config = config
        self.is_healthy = True
        self.request_count = 0
        self.error_count = 0
        self.consecutive_failures = 0
        self.circuit_breaker_until: Optional[datetime] = None
        self.last_success: Optional[datetime] = None
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> str:
        pass
    
    async def health_check(self) -> bool:
        try:
            await asyncio.wait_for(
                self.generate_response("Health check", is_healthcheck=True),
                timeout=5
            )
            self.is_healthy = True
            self.consecutive_failures = 0
            self.last_success = datetime.now()
            return True
        except Exception:
            self.is_healthy = False
            self.consecutive_failures += 1
            return False
    
    def register_success(self):
        self.consecutive_failures = 0
        self.last_success = datetime.now()
        if self.circuit_breaker_until:
            self.circuit_breaker_until = None
    
    def register_failure(self):
        self.consecutive_failures += 1
        self.error_count += 1
    
    def is_circuit_breaker_active(self) -> bool:
        return (self.circuit_breaker_until and 
                datetime.now() < self.circuit_breaker_until)
    
    def trip_circuit_breaker(self, cooldown_sec: int):
        self.circuit_breaker_until = datetime.now() + timedelta(seconds=cooldown_sec)
        self.is_healthy = False

class ClaudeAdapter(BaseModel):
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.1 + random.random() * 0.2)
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        if random.random() < 0.02:
            raise Exception("Simulated Claude API error")
        return f"Claude analysis: {prompt[:100]}..."

class GPTAdapter(BaseModel):
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.15 + random.random() * 0.25)
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        if random.random() < 0.03:
            raise Exception("Simulated GPT API error")
        return f"GPT analysis: {prompt[:100]}..."

class LocalLLMAdapter(BaseModel):
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.3 + random.random() * 0.4)
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        if random.random() < 0.05:
            raise Exception("Simulated local LLM error")
        return f"Local analysis: {prompt[:100]}..."

# Scientific Validator (Layer 3: Embedded Validation)
class ScientificMethodValidator:
    def __init__(self, config: ScientificValidationConfig):
        self.config = config
        self.metrics_history: Dict[str, List[Dict[str, Any]]] = {}
        self.validation_cache: Dict[str, Dict[str, Any]] = {}
    
    def record_metric(self, metric_name: str, value: float, metadata: Dict[str, Any] = None):
        if metric_name not in self.metrics_history:
            self.metrics_history[metric_name] = []
        
        entry = {
            "value": value,
            "timestamp": datetime.now(),
            "metadata": metadata or {}
        }
        self.metrics_history[metric_name].append(entry)
        
        if metric_name in self.validation_cache:
            del self.validation_cache[metric_name]
    
    def validate_performance(self, metric_name: str) -> Dict[str, Any]:
        if metric_name not in self.metrics_history:
            return {"status": "no_data", "sample_size": 0}
        
        cutoff_time = datetime.now() - timedelta(hours=self.config.validation_window_hours)
        recent_entries = [
            entry for entry in self.metrics_history[metric_name]
            if entry["timestamp"] > cutoff_time
        ]
        
        values = [entry["value"] for entry in recent_entries]
        sample_size = len(values)
        
        if sample_size < self.config.min_sample_size:
            return {
                "status": "insufficient_data",
                "sample_size": sample_size,
                "required_size": self.config.min_sample_size
            }
        
        mean_value = sum(values) / sample_size
        if sample_size > 1:
            variance = sum((x - mean_value) ** 2 for x in values) / (sample_size - 1)
            std_dev = variance ** 0.5
        else:
            std_dev = 0.0
        
        return {
            "status": "validated",
            "sample_size": sample_size,
            "mean": mean_value,
            "std_dev": std_dev,
            "confidence_level": self.config.confidence_level
        }

# Policy Engine (Layer 4: Automated Decisions)
class PolicyEngine:
    def __init__(self, config: PolicyConfig):
        self.config = config
        self.decision_history: List[Dict[str, Any]] = []
    
    def decide(self, validator: ScientificMethodValidator) -> Dict[str, Any]:
        accuracy_result = validator.validate_performance("accuracy")
        latency_result = validator.validate_performance("latency")
        
        if (accuracy_result.get("status") != "validated" or 
            latency_result.get("status") != "validated"):
            decision = "ITERATE"
            reason = "Insufficient validation data"
            confidence = 0.0
        else:
            accuracy_mean = accuracy_result["mean"]
            latency_mean = latency_result["mean"]
            sample_size = min(accuracy_result["sample_size"], latency_result["sample_size"])
            
            if sample_size < self.config.min_sample_size:
                decision = "ITERATE"
                reason = f"Sample size {sample_size} below minimum"
                confidence = 0.3
            elif (accuracy_mean >= self.config.min_success_rate and 
                  latency_mean <= self.config.max_latency):
                decision = "SHIP"
                reason = f"Performance meets thresholds"
                confidence = 0.9
            elif accuracy_mean < (self.config.min_success_rate * 0.8):
                decision = "ROLLBACK"
                reason = f"Accuracy critically low"
                confidence = 0.95
            else:
                decision = "ITERATE"
                reason = f"Performance below thresholds"
                confidence = 0.7
        
        result = {
            "decision": decision,
            "reason": reason,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        }
        
        self.decision_history.append(result)
        return result

# Presentation Engine (Layer 5: Multi-Audience Reports)
class PresentationEngine:
    def generate_executive_report(self, orchestrator: 'MultiModelOrchestrator', 
                                decision_result: Dict[str, Any]) -> Dict[str, Any]:
        status = orchestrator.get_status()
        total_requests = sum(m["requests"] for m in status["models"].values())
        total_errors = sum(m["errors"] for m in status["models"].values())
        success_rate = (total_requests - total_errors) / max(total_requests, 1)
        
        return {
            "report_type": "executive_summary",
            "timestamp": datetime.now().isoformat(),
            "decision": decision_result["decision"],
            "confidence": f"{decision_result['confidence']:.0%}",
            "success_rate": f"{success_rate:.1%}",
            "total_requests": total_requests,
            "summary": f"Processed {total_requests} chunks with {success_rate:.1%} success rate. Recommendation: {decision_result['decision']}."
        }

# Main Orchestrator (Layer 2: Deterministic Orchestration)
class MultiModelOrchestrator:
    def __init__(self, models: Dict[str, BaseModel], config: OrchestrationConfig,
                 validator: ScientificMethodValidator, policy_engine: PolicyEngine,
                 presentation_engine: PresentationEngine):
        self.models = models
        self.config = config
        self.validator = validator
        self.policy_engine = policy_engine
        self.presentation_engine = presentation_engine
        self.active = False
        self.health_check_task = None
        self._select_lock = asyncio.Lock()
        self.current_model_index = 0
    
    async def start(self):
        if self.active:
            return
        
        healthy_models = []
        for name, model in self.models.items():
            if await model.health_check():
                healthy_models.append(name)
                logger.info(f"✓ {name} model healthy")
        
        if not healthy_models:
            raise RuntimeError("No healthy models available")
        
        self.active = True
        self.health_check_task = asyncio.create_task(self._periodic_health_checks())
        logger.info(f"🚀 USF Orchestrator active with {len(healthy_models)} models")
    
    async def stop(self):
        if not self.active:
            return
        
        self.active = False
        if self.health_check_task:
            self.health_check_task.cancel()
            try:
                await self.health_check_task
            except asyncio.CancelledError:
                pass
    
    async def process_chunk(self, chunk: Chunk, **kwargs) -> Dict[str, Any]:
        if not self.active:
            raise RuntimeError("Orchestrator not active")

        start_time = datetime.now()
        model = await self._select_model()
        last_error = None

        for attempt in range(self.config.max_retries):
            try:
                response = await asyncio.wait_for(
                    model.generate_response(chunk.text, **kwargs),
                    timeout=model.config.timeout_sec
                )
                
                latency = (datetime.now() - start_time).total_seconds()
                self.validator.record_metric("accuracy", 1.0, {"model": model.config.model_id})
                self.validator.record_metric("latency", latency, {"model": model.config.model_id})
                
                coherence_score = 0.85 + random.random() * 0.14
                self.validator.record_metric("coherence", coherence_score, {"model": model.config.model_id})
                
                model.register_success()
                
                return {
                    "chunk_id": chunk.chunk_id,
                    "response": response,
                    "model_used": model.config.model_id,
                    "latency_sec": latency,
                    "coherence_score": coherence_score,
                    "status": "success",
                    "attempt": attempt + 1
                }
                
            except Exception as e:
                last_error = e
                model.register_failure()
                self.validator.record_metric("accuracy", 0.0, {"model": model.config.model_id, "error": str(e)})
                
                # Trip circuit breaker if consecutive failures exceed threshold
                if model.consecutive_failures >= self.config.circuit_breaker_threshold:
                    model.trip_circuit_breaker(self.config.circuit_breaker_cooldown_sec)
                
                # Exponential backoff with jitter for remaining attempts
                if attempt < self.config.max_retries - 1:
                    backoff = self.config.retry_delay_sec * (2 ** attempt)
                    jitter = random.uniform(0.1, 0.3) * backoff  # 10-30% jitter
                    await asyncio.sleep(backoff + jitter)
                    model = await self._select_fallback_model(model)

        total_time = (datetime.now() - start_time).total_seconds()
        return {
            "chunk_id": chunk.chunk_id,
            "response": None,
            "error": f"All attempts failed: {last_error}",
            "latency_sec": total_time,
            "attempts": self.config.max_retries,
            "status": "failed"
        }
    
    async def _select_model(self) -> BaseModel:
        async with self._select_lock:
            available = [(name, model) for name, model in self.models.items()
                        if model.is_healthy and not model.is_circuit_breaker_active()]
            
            if not available:
                available = [(name, model) for name, model in self.models.items() if model.is_healthy]
            
            if not available:
                raise RuntimeError("No healthy models available")
            
            if self.config.load_balancing_strategy == "weighted_random":
                names, models = zip(*available)
                weights = [self.config.model_weights.get(name, 1.0) for name in names]
                return random.choices(models, weights=weights, k=1)[0]
            else:
                _, model = available[self.current_model_index % len(available)]
                self.current_model_index += 1
                return model
    
    async def _select_fallback_model(self, failed_model: BaseModel) -> BaseModel:
        """Select fallback model avoiding the failed one"""
        async with self._select_lock:
            candidates = [model for model in self.models.values()
                         if (model.is_healthy and 
                             not model.is_circuit_breaker_active() and 
                             model is not failed_model)]
            
            if not candidates:
                return failed_model  # No better option available
            
            # Select highest weighted available model
            best_model = candidates[0]
            best_weight = 0
            
            for model in candidates:
                weight = self.config.model_weights.get(model.config.model_id, 1.0)
                if weight > best_weight:
                    best_weight = weight
                    best_model = model
            
            return best_model
    
    async def _periodic_health_checks(self):
        while self.active:
            try:
                await asyncio.sleep(self.config.health_check_interval)
                for name, model in self.models.items():
                    await model.health_check()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Health check error: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        return {
            "active": self.active,
            "models": {
                name: {
                    "healthy": model.is_healthy,
                    "requests": model.request_count,
                    "errors": model.error_count,
                    "error_rate": model.error_count / max(model.request_count, 1)
                }
                for name, model in self.models.items()
            },
            "validation_status": {
                metric: self.validator.validate_performance(metric)
                for metric in self.validator.config.metrics
            }
        }

# =============================================================================
# PART 3: INTEGRATED PIPELINE
# =============================================================================

# Default USF Configuration
DEFAULT_USF_CONFIG = {
    "models": {
        "claude_primary": {
            "type": "anthropic_claude",
            "model_id": "claude-latest",
            "weight": 0.5,
            "timeout_sec": 30
        },
        "gpt_secondary": {
            "type": "openai_gpt", 
            "model_id": "gpt-4",
            "weight": 0.3,
            "timeout_sec": 25
        },
        "local_backup": {
            "type": "custom_llm",
            "model_id": "local_llm",
            "weight": 0.2,
            "timeout_sec": 45
        }
    },
    "orchestration": {
        "load_balancing_strategy": "weighted_random",
        "max_retries": 3,
        "retry_delay_sec": 2
    },
    "validation": {
        "confidence_level": 0.95,
        "min_sample_size": 15,
        "metrics": ["accuracy", "latency", "coherence"]
    },
    "policy": {
        "min_success_rate": 0.95,
        "max_latency": 1.5,
        "min_sample_size": 20
    }
}

def create_model(model_name: str, model_config: Dict[str, Any]) -> BaseModel:
    config = ModelConfig(
        type=model_config["type"],
        model_id=model_config["model_id"],
        capabilities=model_config.get("capabilities", []),
        weight=model_config.get("weight", 1.0),
        timeout_sec=model_config.get("timeout_sec", 30)
    )
    
    model_type = model_config["type"].lower()
    if model_type == "anthropic_claude":
        return ClaudeAdapter(config)
    elif model_type == "openai_gpt":
        return GPTAdapter(config)
    elif model_type == "custom_llm":
        return LocalLLMAdapter(config)
    else:
        raise ValueError(f"Unknown model type: {model_config['type']}")

async def create_orchestrator(config: Dict[str, Any] = None) -> MultiModelOrchestrator:
    """Create USF orchestrator from configuration"""
    if config is None:
        config = DEFAULT_USF_CONFIG
    
    # Create models
    models = {}
    model_weights = {}
    for name, model_config in config["models"].items():
        models[name] = create_model(name, model_config)
        model_weights[name] = model_config.get("weight", 1.0)
    
    # Create configurations
    orch_config = OrchestrationConfig(
        load_balancing_strategy=config["orchestration"]["load_balancing_strategy"],
        model_weights=model_weights,
        max_retries=config["orchestration"]["max_retries"],
        retry_delay_sec=config["orchestration"]["retry_delay_sec"]
    )
    
    val_config = ScientificValidationConfig(
        confidence_level=config["validation"]["confidence_level"],
        min_sample_size=config["validation"]["min_sample_size"],
        metrics=config["validation"]["metrics"]
    )
    
    policy_config = PolicyConfig(
        min_success_rate=config["policy"]["min_success_rate"],
        max_latency=config["policy"]["max_latency"],
        min_sample_size=config["policy"]["min_sample_size"]
    )
    
    # Create components
    validator = ScientificMethodValidator(val_config)
    policy_engine = PolicyEngine(policy_config)
    presentation_engine = PresentationEngine()
    
    # Create orchestrator
    orchestrator = MultiModelOrchestrator(
        models=models,
        config=orch_config,
        validator=validator,
        policy_engine=policy_engine,
        presentation_engine=presentation_engine
    )
    
    await orchestrator.start()
    return orchestrator

# =============================================================================
# PART 4: COMMAND LINE INTERFACE
# =============================================================================

async def cmd_chunk(args):
    """Chunk HTML documents into JSONL format"""
    input_path = Path(args.input)
    output_path = Path(args.output)
    output_path.mkdir(parents=True, exist_ok=True)
    
    if input_path.is_dir():
        html_files = list(input_path.rglob("*.html")) + list(input_path.rglob("*.htm"))
    else:
        html_files = [input_path]
    
    if not html_files:
        print("No HTML files found")
        return
    
    all_chunks = []
    per_doc_counts = {}
    
    for html_file in html_files:
        print(f"Processing {html_file.name}...")
        chunks = process_html_file(html_file, output_path, args.target_tokens, args.overlap)
        all_chunks.extend(chunks)
        per_doc_counts[html_file.stem] = len(chunks)
    
    # Generate manifest with policy decision
    token_sizes = [c.est_tokens for c in all_chunks]
    if token_sizes:
        p50 = percentile(token_sizes, 50)
        p95 = percentile(token_sizes, 95)
        mean = statistics.mean(token_sizes)
        decision = "SHIP" if (p95 <= 1.6 * args.target_tokens and mean >= 0.4 * args.target_tokens) else "ITERATE"
    else:
        p50 = p95 = mean = 0
        decision = "ITERATE"
    
    manifest = {
        "session_id": f"html_chunking_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "generated_utc": datetime.utcnow().isoformat() + "Z",
        "target_tokens": args.target_tokens,
        "overlap_tokens": args.overlap,
        "total_chunks": len(all_chunks),
        "stats": {
            "p50_tokens": p50,
            "p95_tokens": p95,
            "mean_tokens": mean
        },
        "documents": [{"doc_id": doc_id, "chunk_count": count} 
                     for doc_id, count in sorted(per_doc_counts.items())],
        "policy_decision": decision
    }
    
    with open(output_path / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"✓ Processed {len(html_files)} files → {len(all_chunks)} chunks")
    print(f"✓ Policy decision: {decision}")
    print(f"✓ Output: {output_path}")

async def cmd_process(args):
    """Process chunks through USF orchestrator"""
    input_path = Path(args.input)
    output_path = Path(args.output)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Find chunk files
    if input_path.is_dir():
        jsonl_files = list(input_path.glob("*.jsonl"))
        jsonl_files = [f for f in jsonl_files if f.stem != "chunks"]  # Skip aggregate
    else:
        jsonl_files = [input_path]
    
    if not jsonl_files:
        print("No JSONL chunk files found")
        return
    
    # Create orchestrator
    print("Initializing Universal Session Framework...")
    orchestrator = await create_orchestrator()
    
    all_results = []
    
    # Set up concurrency control
    concurrency = getattr(args, 'concurrency', 6)
    semaphore = asyncio.Semaphore(concurrency)
    
    async def process_one_chunk(chunk: Chunk):
        async with semaphore:
            return await orchestrator.process_chunk(chunk)
    
    try:
        for jsonl_file in jsonl_files:
            print(f"Processing {jsonl_file.name}...")
            
            with open(jsonl_file, 'r') as f:
                chunks = [Chunk(**json.loads(line)) for line in f if line.strip()]
            
            print(f"  Processing {len(chunks)} chunks with concurrency={concurrency}...")
            
            # Process chunks concurrently
            doc_results = await asyncio.gather(
                *[process_one_chunk(chunk) for chunk in chunks],
                return_exceptions=True
            )
            
            # Handle any exceptions
            processed_results = []
            for i, result in enumerate(doc_results):
                if isinstance(result, Exception):
                    processed_results.append({
                        "chunk_id": chunks[i].chunk_id,
                        "response": None,
                        "error": str(result),
                        "status": "failed"
                    })
                else:
                    processed_results.append(result)
            
            all_results.extend(processed_results)
            
            # Save per-document results
            output_file = output_path / f"{jsonl_file.stem}_results.jsonl"
            with open(output_file, 'w') as f:
                for result in processed_results:
                    f.write(json.dumps(result, ensure_ascii=False) + "\n")
        
        # Generate policy decision and reports
        print("\n🎯 Generating policy decision...")
        decision_result = orchestrator.policy_engine.decide(orchestrator.validator)
        print(f"Decision: {decision_result['decision']}")
        print(f"Reason: {decision_result['reason']}")
        print(f"Confidence: {decision_result['confidence']:.1%}")
        
        # Generate executive report
        exec_report = orchestrator.presentation_engine.generate_executive_report(
            orchestrator, decision_result
        )
        
        # Save comprehensive results
        final_report = {
            "processing_summary": {
                "total_chunks": len(all_results),
                "successful": len([r for r in all_results if r["status"] == "success"]),
                "failed": len([r for r in all_results if r["status"] == "failed"]),
                "success_rate": len([r for r in all_results if r["status"] == "success"]) / len(all_results),
                "concurrency_used": concurrency
            },
            "policy_decision": decision_result,
            "executive_report": exec_report,
            "system_status": orchestrator.get_status(),
            "config_hash": sha256_json(DEFAULT_USF_CONFIG)
        }
        
        with open(output_path / "processing_report.json", "w") as f:
            json.dump(final_report, f, indent=2, default=str)
        
        print(f"\n✅ Processing complete!")
        print(f"✅ Success rate: {final_report['processing_summary']['success_rate']:.1%}")
        print(f"✅ Policy decision: {decision_result['decision']}")
        print(f"✅ Results saved to: {output_path}")
    
    finally:
        await orchestrator.stop()

async def cmd_report(args):
    """Generate summary report from processing results"""
    input_path = Path(args.input)
    report_file = input_path / "processing_report.json"
    
    if not report_file.exists():
        print(f"❌ Processing report not found: {report_file}")
        return
    
    try:
        report = json.loads(report_file.read_text())
        
        # Processing summary
        summary = report["processing_summary"]
        print("=" * 60)
        print("PROCESSING SUMMARY")
        print("=" * 60)
        print(f"Total Chunks: {summary['total_chunks']}")
        print(f"Successful: {summary['successful']} ({summary['success_rate']:.1%})")
        print(f"Failed: {summary['failed']}")
        if 'concurrency_used' in summary:
            print(f"Concurrency: {summary['concurrency_used']}")
        
        # Policy decision
        decision = report["policy_decision"]
        print(f"\n🎯 POLICY DECISION: {decision['decision']}")
        print(f"   Confidence: {decision['confidence']:.1%}")
        print(f"   Reason: {decision['reason']}")
        
        # System status
        if "system_status" in report:
            status = report["system_status"]
            print(f"\n📊 SYSTEM STATUS:")
            print(f"   Framework Active: {status.get('active', 'Unknown')}")
            
            if "models" in status:
                print("   Model Health:")
                for name, model in status["models"].items():
                    health = "✅" if model.get("healthy", False) else "❌"
                    error_rate = model.get("error_rate", 0)
                    requests = model.get("requests", 0)
                    print(f"     {health} {name}: {requests} requests, {error_rate:.1%} error rate")
        
        # Config info
        if "config_hash" in report:
            print(f"\n🔧 CONFIG HASH: {report['config_hash'][:16]}...")
        
        print("=" * 60)
        
    except json.JSONDecodeError as e:
        print(f"❌ Error reading report JSON: {e}")
    except KeyError as e:
        print(f"❌ Missing field in report: {e}")

async def cmd_demo(args):
    """Run complete pipeline demonstration"""
    print("=" * 80)
    print("COMPLETE CONTENT PROCESSING ECOSYSTEM DEMONSTRATION")
    print("HTML Chunker + Universal Session Framework v2.0.0")
    print("=" * 80)
    
    # Create sample HTML content
    sample_html = """
    <html>
    <head><title>Sample Document</title></head>
    <body>
        <nav><a href="#">Navigation</a></nav>
        <h1>Introduction to AI Systems</h1>
        <p>Artificial Intelligence systems are transforming how we process and understand information. 
           These systems can analyze vast amounts of data, identify patterns, and make decisions 
           that would be difficult or time-consuming for humans.</p>
        
        <h2>Machine Learning Fundamentals</h2>
        <p>Machine learning is a subset of AI that focuses on algorithms that can learn from data. 
           These algorithms improve their performance on a specific task through experience, 
           without being explicitly programmed for every possible scenario.</p>
        
        <h3>Supervised Learning</h3>
        <p>In supervised learning, algorithms learn from labeled training data. The system learns 
           to map inputs to correct outputs based on example input-output pairs.</p>
        
        <h3>Unsupervised Learning</h3>
        <p>Unsupervised learning involves finding hidden patterns in data without labeled examples. 
           Common techniques include clustering, dimensionality reduction, and association rules.</p>
        
        <h2>Neural Networks</h2>
        <p>Neural networks are computing systems inspired by biological neural networks. They consist 
           of interconnected nodes (neurons) that process information through weighted connections.</p>
        
        <footer>Copyright 2024</footer>
    </body>
    </html>
    """
    
    # Create temporary files
    temp_dir = Path("demo_temp")
    temp_dir.mkdir(exist_ok=True)
    
    html_file = temp_dir / "sample.html"
    chunks_dir = temp_dir / "chunks"
    results_dir = temp_dir / "results"
    
    html_file.write_text(sample_html)
    
    try:
        # Step 1: Chunk the HTML
        print("\n📄 Step 1: Chunking HTML document...")
        chunks_dir.mkdir(exist_ok=True)
        chunks = process_html_file(html_file, chunks_dir, target_tokens=200, overlap_tokens=50)
        print(f"✓ Generated {len(chunks)} chunks")
        
        # Step 2: Process through USF
        print("\n🤖 Step 2: Processing chunks through USF...")
        results_dir.mkdir(exist_ok=True)
        orchestrator = await create_orchestrator()
        
        # Use small concurrency for demo
        concurrency = getattr(args, 'concurrency', 3)
        semaphore = asyncio.Semaphore(concurrency)
        
        async def process_demo_chunk(chunk: Chunk):
            async with semaphore:
                return await orchestrator.process_chunk(chunk)
        
        print(f"  Processing {len(chunks)} chunks with concurrency={concurrency}...")
        results = await asyncio.gather(*[process_demo_chunk(chunk) for chunk in chunks])
        
        # Step 3: Generate reports
        print("\n📊 Step 3: Generating policy decision and reports...")
        decision_result = orchestrator.policy_engine.decide(orchestrator.validator)
        exec_report = orchestrator.presentation_engine.generate_executive_report(
            orchestrator, decision_result
        )
        
        # Display results
        print(f"\n🎯 POLICY DECISION: {decision_result['decision']}")
        print(f"   Reason: {decision_result['reason']}")
        print(f"   Confidence: {decision_result['confidence']:.1%}")
        
        print(f"\n📈 EXECUTIVE SUMMARY:")
        print(f"   Total Requests: {exec_report['total_requests']}")
        print(f"   Success Rate: {exec_report['success_rate']}")
        print(f"   System Status: {exec_report.get('summary', 'Processing complete')}")
        
        print(f"\n📋 CHUNK PROCESSING RESULTS:")
        for i, (chunk, result) in enumerate(zip(chunks, results)):
            status = "✅" if result["status"] == "success" else "❌"
            print(f"   {status} Chunk {i+1}: {chunk.headings} → {result['model_used'] if result['status'] == 'success' else 'Failed'}")
        
        await orchestrator.stop()
        
        print(f"\n✅ DEMONSTRATION COMPLETE")
        print(f"Successfully demonstrated the complete pipeline:")
        print(f"  HTML → {len(chunks)} chunks → {len([r for r in results if r['status'] == 'success'])} successful AI responses")
        
    finally:
        # Cleanup
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)

def main():
    parser = argparse.ArgumentParser(
        description="Complete Content Processing Ecosystem - HTML Chunker + USF v2.0.0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python pipeline.py chunk -i docs/ -o chunks/ --target-tokens 800 --overlap 120
  python pipeline.py process -i chunks/ -o results/ --concurrency 8
  python pipeline.py report -i results/
  python pipeline.py demo --concurrency 3
        """
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Chunk command
    chunk_parser = subparsers.add_parser("chunk", help="Chunk HTML documents")
    chunk_parser.add_argument("-i", "--input", required=True, help="Input HTML file or directory")
    chunk_parser.add_argument("-o", "--output", required=True, help="Output directory")
    chunk_parser.add_argument("--target-tokens", type=int, default=800, help="Target tokens per chunk")
    chunk_parser.add_argument("--overlap", type=int, default=120, help="Overlap tokens between chunks")
    
    # Process command  
    process_parser = subparsers.add_parser("process", help="Process chunks through USF")
    process_parser.add_argument("-i", "--input", required=True, help="Input JSONL directory")
    process_parser.add_argument("-o", "--output", required=True, help="Output directory")
    process_parser.add_argument("--concurrency", type=int, default=6, help="Concurrent chunk processing tasks")
    
    # Report command
    report_parser = subparsers.add_parser("report", help="Summarize processing results")
    report_parser.add_argument("-i", "--input", required=True, help="Results directory containing processing_report.json")
    
    # Demo command
    demo_parser = subparsers.add_parser("demo", help="Run complete pipeline demonstration")
    demo_parser.add_argument("--concurrency", type=int, default=3, help="Concurrent processing for demo")
    
    args = parser.parse_args()
    
    if args.command == "chunk":
        asyncio.run(cmd_chunk(args))
    elif args.command == "process":
        asyncio.run(cmd_process(args))
    elif args.command == "report":
        asyncio.run(cmd_report(args))
    elif args.command == "demo":
        asyncio.run(cmd_demo(args))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
---
#!/usr/bin/env python3
"""
Five-Layer Architecture + Perfect Prompt Logic Bridge
====================================================

Integrating systematic prompt optimization into our Five-Layer Architecture
for self-optimizing, organizationally-native AI infrastructure.

Enhanced Architecture:
- Layer 1: Problem Definition + Prompt Optimization (Scientific Template Generation)
- Layer 2: Deterministic Orchestration + Adaptive Prompting (Context-Aware Execution)
- Layer 3: Embedded Validation + Prompt Performance (Statistical Prompt Analysis)
- Layer 4: Policy Enforcement + Prompt Evolution (Automated Prompt Improvement)
- Layer 5: Presentation Abstraction + Optimization Reports (Multi-Audience Prompt Analytics)

Integration Points:
    Perfect Prompt Logic → [Enhanced L1] → Optimized Prompts → [L2-L5] → Performance Feedback → Prompt Evolution
"""

import asyncio
import json
import hashlib
import logging
import random
import statistics
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field, asdict
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

# =============================================================================
# PERFECT PROMPT LOGIC INTEGRATION (Enhanced Layer 1)
# =============================================================================

@dataclass
class PromptTemplate:
    """Scientific prompt template with validation criteria"""
    template_id: str
    name: str
    domain: str
    template_text: str
    success_criteria: Dict[str, float]
    constraints: Dict[str, Any]
    validation_history: List[Dict[str, Any]] = field(default_factory=list)
    performance_score: float = 0.0
    generation_count: int = 0

@dataclass
class PromptOptimizationConfig:
    """Configuration for systematic prompt optimization"""
    target_models: List[str] = field(default_factory=lambda: ["claude", "gpt", "local"])
    optimization_objectives: Dict[str, float] = field(default_factory=lambda: {
        "accuracy": 0.90,
        "coherence": 0.85,
        "latency": 2.0,
        "consistency": 0.90
    })
    iteration_limit: int = 10
    success_threshold: float = 0.85
    validation_sample_size: int = 20

class PromptOptimizer:
    """Layer 1 Enhancement: Systematic Prompt Optimization Engine"""
    
    def __init__(self, config: PromptOptimizationConfig):
        self.config = config
        self.templates: Dict[str, PromptTemplate] = {}
        self.optimization_history: List[Dict[str, Any]] = []
        
        # Load base templates for different content types
        self._initialize_base_templates()
    
    def _initialize_base_templates(self):
        """Initialize domain-specific prompt templates"""
        
        # Technical Documentation Template
        tech_template = PromptTemplate(
            template_id="tech_doc_v1",
            name="Technical Documentation Analyzer",
            domain="technical",
            template_text="""# Technical Analysis Request

## Context
You are analyzing a technical document chunk with the following context:
- Headings: {headings}
- Document Source: {source_path}
- Chunk Position: {chunk_id}

## Task
Provide a comprehensive technical analysis that includes:
1. **Key Concepts**: Identify main technical concepts and terminology
2. **Dependencies**: Note any dependencies, prerequisites, or relationships
3. **Implementation Details**: Extract actionable implementation information
4. **Validation Points**: Identify testable or verifiable claims

## Content to Analyze
{content}

## Response Requirements
- Be precise and technically accurate
- Preserve all specific technical details
- Identify any potential issues or gaps
- Provide confidence assessment for technical claims

Respond in structured markdown with clear sections.""",
            success_criteria={
                "accuracy": 0.90,
                "technical_depth": 0.85,
                "completeness": 0.80,
                "actionability": 0.75
            },
            constraints={
                "max_tokens": 1500,
                "response_time_ms": 3000,
                "must_include": ["key_concepts", "implementation_details", "confidence_assessment"]
            }
        )
        
        # Creative Content Template
        creative_template = PromptTemplate(
            template_id="creative_v1",
            name="Creative Content Synthesizer",
            domain="creative",
            template_text="""# Creative Synthesis Request

## Context & Inspiration
Drawing from the content context:
- Theme Elements: {headings}
- Source Material: {source_path}
- Creative Scope: {chunk_id}

## Creative Mission
Transform this content into engaging, accessible insights:
1. **Core Message**: Distill the essential narrative
2. **Engaging Elements**: Identify compelling angles or stories
3. **Audience Connection**: Make complex ideas relatable
4. **Creative Enhancement**: Add metaphors, examples, or analogies

## Source Material
{content}

## Output Style
- Engaging and accessible tone
- Preserve factual accuracy while enhancing readability
- Include vivid examples or analogies where appropriate
- Maintain professional credibility

Structure your response with clear, engaging sections.""",
            success_criteria={
                "engagement": 0.85,
                "clarity": 0.90,
                "creativity": 0.75,
                "accuracy": 0.85
            },
            constraints={
                "max_tokens": 1200,
                "response_time_ms": 2500,
                "must_include": ["core_message", "audience_connection", "engaging_elements"]
            }
        )
        
        # Analytical Template
        analytical_template = PromptTemplate(
            template_id="analytical_v1",
            name="Strategic Analysis Engine",
            domain="analytical",
            template_text="""# Strategic Analysis Framework

## Analysis Context
Examining content through strategic lens:
- Content Structure: {headings}
- Information Source: {source_path}
- Analysis Target: {chunk_id}

## Analytical Objectives
Provide systematic analysis covering:
1. **Pattern Recognition**: Identify trends, patterns, or relationships
2. **Strategic Implications**: What does this mean for decision-making?
3. **Risk Assessment**: Potential challenges or opportunities
4. **Quantitative Insights**: Extract measurable or comparable data
5. **Recommendations**: Actionable next steps or considerations

## Content for Analysis
{content}

## Analysis Standards
- Support conclusions with evidence from the content
- Quantify insights where possible
- Identify confidence levels for assertions
- Flag assumptions or areas needing additional data
- Prioritize actionable insights

Deliver analysis in structured format with executive summary.""",
            success_criteria={
                "analytical_depth": 0.88,
                "evidence_support": 0.85,
                "actionability": 0.82,
                "strategic_value": 0.80
            },
            constraints={
                "max_tokens": 1600,
                "response_time_ms": 3500,
                "must_include": ["pattern_recognition", "strategic_implications", "recommendations"]
            }
        )
        
        self.templates = {
            "technical": tech_template,
            "creative": creative_template,
            "analytical": analytical_template
        }
    
    def select_optimal_prompt(self, chunk_context: Dict[str, Any]) -> PromptTemplate:
        """Select the best prompt template based on content context"""
        
        # Analyze content to determine domain
        headings = chunk_context.get("headings", [])
        content = chunk_context.get("text", "")
        
        # Simple domain classification (could be enhanced with ML)
        domain_scores = {
            "technical": self._score_technical_content(headings, content),
            "creative": self._score_creative_content(headings, content),
            "analytical": self._score_analytical_content(headings, content)
        }
        
        # Select highest scoring domain
        best_domain = max(domain_scores, key=domain_scores.get)
        return self.templates[best_domain]
    
    def _score_technical_content(self, headings: List[str], content: str) -> float:
        """Score content for technical domain fit"""
        technical_indicators = [
            "implementation", "algorithm", "function", "method", "class",
            "API", "configuration", "setup", "install", "deploy", "code",
            "system", "architecture", "protocol", "specification"
        ]
        
        text = " ".join(headings).lower() + " " + content.lower()
        matches = sum(1 for indicator in technical_indicators if indicator in text)
        return min(matches / 5.0, 1.0)  # Normalize to 0-1
    
    def _score_creative_content(self, headings: List[str], content: str) -> float:
        """Score content for creative domain fit"""
        creative_indicators = [
            "story", "narrative", "example", "introduction", "overview",
            "guide", "tutorial", "explain", "understand", "learn",
            "concept", "idea", "approach", "strategy", "vision"
        ]
        
        text = " ".join(headings).lower() + " " + content.lower()
        matches = sum(1 for indicator in creative_indicators if indicator in text)
        return min(matches / 4.0, 1.0)
    
    def _score_analytical_content(self, headings: List[str], content: str) -> float:
        """Score content for analytical domain fit"""
        analytical_indicators = [
            "analysis", "data", "results", "performance", "metrics",
            "comparison", "evaluation", "assessment", "review", "trends",
            "statistics", "research", "findings", "conclusions", "recommendations"
        ]
        
        text = " ".join(headings).lower() + " " + content.lower()
        matches = sum(1 for indicator in analytical_indicators if indicator in text)
        return min(matches / 4.0, 1.0)
    
    def generate_optimized_prompt(self, chunk_context: Dict[str, Any]) -> str:
        """Generate optimized prompt for specific chunk context"""
        
        template = self.select_optimal_prompt(chunk_context)
        
        # Format the template with chunk context
        optimized_prompt = template.template_text.format(
            headings=", ".join(chunk_context.get("headings", [])),
            source_path=chunk_context.get("source_path", "unknown"),
            chunk_id=chunk_context.get("chunk_id", "unknown"),
            content=chunk_context.get("text", "")
        )
        
        # Track generation
        template.generation_count += 1
        
        return optimized_prompt
    
    def record_prompt_performance(self, template_id: str, performance_metrics: Dict[str, float]):
        """Record performance metrics for prompt optimization"""
        
        if template_id in self.templates:
            template = self.templates[template_id]
            
            # Add to validation history
            template.validation_history.append({
                "timestamp": datetime.now().isoformat(),
                "metrics": performance_metrics,
                "generation_count": template.generation_count
            })
            
            # Update performance score (weighted average)
            if template.validation_history:
                recent_scores = [entry["metrics"].get("overall_score", 0.0) 
                               for entry in template.validation_history[-10:]]
                template.performance_score = statistics.mean(recent_scores)
    
    def optimize_templates(self) -> Dict[str, Any]:
        """Analyze performance and suggest template optimizations"""
        
        optimization_report = {
            "timestamp": datetime.now().isoformat(),
            "templates_analyzed": len(self.templates),
            "optimization_recommendations": []
        }
        
        for template_id, template in self.templates.items():
            if len(template.validation_history) >= 5:  # Minimum data for analysis
                
                # Analyze performance trends
                recent_metrics = template.validation_history[-10:]
                avg_performance = statistics.mean([
                    entry["metrics"].get("overall_score", 0.0) 
                    for entry in recent_metrics
                ])
                
                # Generate recommendations
                if avg_performance < self.config.success_threshold:
                    recommendation = {
                        "template_id": template_id,
                        "current_performance": avg_performance,
                        "target_performance": self.config.success_threshold,
                        "suggested_improvements": self._generate_improvement_suggestions(template),
                        "priority": "high" if avg_performance < 0.7 else "medium"
                    }
                    optimization_report["optimization_recommendations"].append(recommendation)
        
        return optimization_report
    
    def _generate_improvement_suggestions(self, template: PromptTemplate) -> List[str]:
        """Generate specific improvement suggestions for underperforming templates"""
        
        suggestions = []
        
        # Analyze recent performance patterns
        if template.validation_history:
            recent_metrics = template.validation_history[-5:]
            
            # Check specific metric performance
            accuracy_scores = [entry["metrics"].get("accuracy", 0.0) for entry in recent_metrics]
            clarity_scores = [entry["metrics"].get("coherence", 0.0) for entry in recent_metrics]
            
            if statistics.mean(accuracy_scores) < 0.8:
                suggestions.append("Add more specific accuracy requirements and validation steps")
            
            if statistics.mean(clarity_scores) < 0.8:
                suggestions.append("Simplify language and add clearer structure requirements")
            
            if template.generation_count > 50 and template.performance_score < 0.8:
                suggestions.append("Consider A/B testing alternative prompt structures")
        
        return suggestions or ["Collect more performance data for specific recommendations"]

# =============================================================================
# ENHANCED MODEL ADAPTERS (Layer 1 + Layer 2 Integration)
# =============================================================================

class PromptAwareBaseModel(ABC):
    """Enhanced base model with prompt optimization awareness"""
    
    def __init__(self, config, prompt_optimizer: PromptOptimizer):
        super().__init__()
        self.config = config
        self.prompt_optimizer = prompt_optimizer
        self.is_healthy = True
        self.request_count = 0
        self.error_count = 0
        self.prompt_performance_history: List[Dict[str, Any]] = []
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> str:
        pass
    
    async def generate_optimized_response(self, chunk_context: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Generate response using optimized prompt for the chunk context"""
        
        start_time = datetime.now()
        
        # Generate optimized prompt
        optimized_prompt = self.prompt_optimizer.generate_optimized_prompt(chunk_context)
        
        try:
            # Generate response
            response = await self.generate_response(optimized_prompt, **kwargs)
            
            # Calculate performance metrics
            latency = (datetime.now() - start_time).total_seconds()
            
            # Simple quality scoring (could be enhanced with ML)
            quality_metrics = self._assess_response_quality(response, chunk_context)
            
            # Record prompt performance
            template = self.prompt_optimizer.select_optimal_prompt(chunk_context)
            self.prompt_optimizer.record_prompt_performance(
                template.template_id,
                {**quality_metrics, "latency": latency, "overall_score": quality_metrics.get("overall", 0.8)}
            )
            
            return {
                "response": response,
                "optimized_prompt_used": True,
                "template_id": template.template_id,
                "quality_metrics": quality_metrics,
                "latency_sec": latency,
                "status": "success"
            }
            
        except Exception as e:
            return {
                "response": None,
                "error": str(e),
                "optimized_prompt_used": True,
                "status": "failed"
            }
    
    def _assess_response_quality(self, response: str, chunk_context: Dict[str, Any]) -> Dict[str, float]:
        """Simple response quality assessment (placeholder for more sophisticated scoring)"""
        
        # Basic quality indicators
        response_length = len(response)
        word_count = len(response.split())
        
        # Simple heuristics (could be enhanced with ML models)
        completeness = min(word_count / 200.0, 1.0)  # Expect ~200 words minimum
        structure_score = 0.8 if "##" in response or "**" in response else 0.6  # Has structure
        detail_score = min(response_length / 1000.0, 1.0)  # Adequate detail
        
        overall = statistics.mean([completeness, structure_score, detail_score])
        
        return {
            "completeness": completeness,
            "structure": structure_score,
            "detail": detail_score,
            "overall": overall
        }

class EnhancedClaudeAdapter(PromptAwareBaseModel):
    """Claude adapter with prompt optimization"""
    
    async def generate_response(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.1 + random.random() * 0.2)
        if not kwargs.get("is_healthcheck"):
            self.request_count += 1
        if random.random() < 0.02:
            raise Exception("Simulated Claude API error")
        return f"Claude optimized analysis: {prompt[-200:]}..."

# =============================================================================
# ENHANCED ORCHESTRATOR (Layer 2 + Prompt Integration)
# =============================================================================

class PromptOptimizedOrchestrator:
    """Enhanced orchestrator with prompt optimization integration"""
    
    def __init__(self, models: Dict[str, PromptAwareBaseModel], 
                 prompt_optimizer: PromptOptimizer,
                 config=None):
        self.models = models
        self.prompt_optimizer = prompt_optimizer
        self.config = config or {}
        self.active = False
        self.optimization_reports: List[Dict[str, Any]] = []
    
    async def start(self):
        """Start orchestrator with prompt optimization"""
        if self.active:
            return
            
        logger.info("🚀 Starting Prompt-Optimized Orchestrator...")
        
        # Initialize models
        healthy_models = []
        for name, model in self.models.items():
            # Simple health check
            model.is_healthy = True
            healthy_models.append(name)
            logger.info(f"✓ {name} model ready with prompt optimization")
        
        self.active = True
        logger.info(f"🎯 Prompt-Optimized Orchestrator active with {len(healthy_models)} models")
    
    async def process_chunk_with_optimization(self, chunk_context: Dict[str, Any]) -> Dict[str, Any]:
        """Process chunk using optimized prompts"""
        
        if not self.active:
            raise RuntimeError("Orchestrator not active")
        
        # Select best model (simplified selection)
        model_name = list(self.models.keys())[0]  # Use first available model
        model = self.models[model_name]
        
        # Process with optimized prompt
        result = await model.generate_optimized_response(chunk_context)
        result["model_used"] = model_name
        
        return result
    
    async def generate_optimization_report(self) -> Dict[str, Any]:
        """Generate comprehensive prompt optimization report"""
        
        # Get optimization recommendations
        optimization_analysis = self.prompt_optimizer.optimize_templates()
        
        # Collect model performance data
        model_performance = {}
        for name, model in self.models.items():
            if hasattr(model, 'prompt_performance_history'):
                recent_performance = model.prompt_performance_history[-10:] if model.prompt_performance_history else []
                if recent_performance:
                    avg_quality = statistics.mean([
                        entry.get("quality_metrics", {}).get("overall", 0.0) 
                        for entry in recent_performance
                    ])
                    model_performance[name] = {
                        "average_quality": avg_quality,
                        "total_requests": model.request_count,
                        "optimization_enabled": True
                    }
        
        # Generate comprehensive report
        report = {
            "timestamp": datetime.now().isoformat(),
            "optimization_status": "active",
            "template_analysis": optimization_analysis,
            "model_performance": model_performance,
            "recommendations": {
                "immediate_actions": [],
                "optimization_opportunities": [],
                "performance_improvements": []
            }
        }
        
        # Add specific recommendations
        if optimization_analysis["optimization_recommendations"]:
            report["recommendations"]["immediate_actions"].append(
                "Review and optimize underperforming prompt templates"
            )
        
        report["recommendations"]["optimization_opportunities"].append(
            "Implement A/B testing for prompt variations"
        )
        
        report["recommendations"]["performance_improvements"].append(
            "Expand domain-specific template library"
        )
        
        self.optimization_reports.append(report)
        return report

# =============================================================================
# INTEGRATION LAYER: Bridge to Existing Five-Layer Architecture
# =============================================================================

def create_prompt_optimized_pipeline():
    """Create enhanced pipeline with prompt optimization bridge"""
    
    # Initialize prompt optimizer
    prompt_config = PromptOptimizationConfig(
        target_models=["claude", "gpt", "local"],
        optimization_objectives={
            "accuracy": 0.90,
            "coherence": 0.85,
            "latency": 2.0,
            "consistency": 0.90
        },
        success_threshold=0.85
    )
    
    prompt_optimizer = PromptOptimizer(prompt_config)
    
    # Create enhanced models
    models = {
        "claude_optimized": EnhancedClaudeAdapter(
            config={"model_id": "claude-latest", "timeout_sec": 30},
            prompt_optimizer=prompt_optimizer
        )
    }
    
    # Create enhanced orchestrator
    orchestrator = PromptOptimizedOrchestrator(
        models=models,
        prompt_optimizer=prompt_optimizer
    )
    
    return orchestrator, prompt_optimizer

# =============================================================================
# USAGE EXAMPLE: Integration with Existing Pipeline
# =============================================================================

async def demonstrate_prompt_optimization():
    """Demonstrate prompt optimization integration"""
    
    print("🎯 PROMPT OPTIMIZATION BRIDGE DEMONSTRATION")
    print("=" * 60)
    
    # Create optimized pipeline
    orchestrator, prompt_optimizer = create_prompt_optimized_pipeline()
    await orchestrator.start()
    
    # Sample chunk contexts for different domains
    test_chunks = [
        {
            "chunk_id": "tech_001",
            "headings": ["API Documentation", "Authentication", "OAuth Implementation"],
            "text": "This section covers OAuth 2.0 implementation for API authentication. The process involves client registration, authorization code flow, and token management.",
            "source_path": "api_docs.html"
        },
        {
            "chunk_id": "creative_001", 
            "headings": ["Introduction", "Getting Started", "User Experience"],
            "text": "Welcome to the comprehensive guide for understanding user experience design principles. This introduction will help you navigate the fundamental concepts.",
            "source_path": "ux_guide.html"
        },
        {
            "chunk_id": "analytical_001",
            "headings": ["Performance Analysis", "Metrics", "Benchmarks"],
            "text": "The performance analysis reveals significant improvements in response time with 25% reduction in latency and 40% increase in throughput compared to baseline.",
            "source_path": "performance_report.html"
        }
    ]
    
    # Process each chunk with optimization
    results = []
    for chunk in test_chunks:
        print(f"\nProcessing {chunk['chunk_id']} ({chunk['headings'][0]})...")
        
        result = await orchestrator.process_chunk_with_optimization(chunk)
        results.append(result)
        
        print(f"  ✓ Template: {result.get('template_id', 'unknown')}")
        print(f"  ✓ Quality: {result.get('quality_metrics', {}).get('overall', 0.0):.2f}")
        print(f"  ✓ Status: {result.get('status', 'unknown')}")
    
    # Generate optimization report
    print(f"\n📊 OPTIMIZATION ANALYSIS")
    print("-" * 30)
    
    optimization_report = await orchestrator.generate_optimization_report()
    
    print(f"Templates Analyzed: {optimization_report['template_analysis']['templates_analyzed']}")
    print(f"Optimization Recommendations: {len(optimization_report['template_analysis']['optimization_recommendations'])}")
    
    if optimization_report['template_analysis']['optimization_recommendations']:
        for rec in optimization_report['template_analysis']['optimization_recommendations']:
            print(f"  • {rec['template_id']}: {rec['priority']} priority")
    
    print(f"\nModel Performance:")
    for model_name, perf in optimization_report['model_performance'].items():
        print(f"  • {model_name}: {perf['average_quality']:.2f} avg quality")
    
    print(f"\n✅ PROMPT OPTIMIZATION BRIDGE DEMONSTRATED")
    print(f"Successfully integrated Perfect Prompt Logic with Five-Layer Architecture")
    
    return results, optimization_report

# =============================================================================
# ENHANCED CLI COMMANDS (Integration Points)
# =============================================================================

async def cmd_optimize_prompts(args):
    """New CLI command for prompt optimization"""
    
    print("🎯 Optimizing prompts for content processing...")
    
    # Create optimized pipeline
    orchestrator, prompt_optimizer = create_prompt_optimized_pipeline()
    await orchestrator.start()
    
    # Load chunk data if provided
    if hasattr(args, 'input') and args.input:
        input_path = Path(args.input)
        chunk_files = list(input_path.glob("*.jsonl"))
        
        for chunk_file in chunk_files:
            print(f"Optimizing prompts for {chunk_file.name}...")
            
            with open(chunk_file, 'r') as f:
                chunks = [json.loads(line) for line in f if line.strip()]
            
            # Process with optimization
            for chunk in chunks[:5]:  # Sample first 5 chunks
                chunk_context = {
                    "chunk_id": chunk.get("chunk_id", "unknown"),
                    "headings": chunk.get("headings", []),
                    "text": chunk.get("text", ""),
                    "source_path": chunk.get("source_path", "unknown")
                }
                
                result = await orchestrator.process_chunk_with_optimization(chunk_context)
                print(f"  ✓ {chunk_context['chunk_id']}: {result.get('template_id', 'unknown')} template")
    
    # Generate optimization report
    report = await orchestrator.generate_optimization_report()
    
    # Save optimization report
    output_path = Path(args.output) if hasattr(args, 'output') else Path(".")
    output_path.mkdir(parents=True, exist_ok=True)
    
    with open(output_path / "prompt_optimization_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"✅ Prompt optimization complete")
    print(f"✅ Report saved to {output_path / 'prompt_optimization_report.json'}")

if __name__ == "__main__":
    # Demonstrate the integration
    asyncio.run(demonstrate_prompt_optimization())