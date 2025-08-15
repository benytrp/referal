import json
import time
import random
import hashlib

# ---------------------------------------------------------------------------- #
# 1. THE MASTER SCHEMA (x_logic_schema)
# This is the foundational blueprint that governs the engine's operation.
# ---------------------------------------------------------------------------- #
X_LOGIC_SCHEMA = {
  "schema_version": "1.0",
  "name": "x_logic_schema",
  "description": "Schema for the <x> directive's Autonomous Planning Loop.",
  "properties": {
    "trigger": {"type": "string", "enum": ["<x>"]},
    "contract": {
      "type": "object",
      "properties": {
        "goal": {"type": "string"},
        "constraints": {"type": "array", "items": {"type": "string"}},
        "success_criteria": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["goal", "constraints", "success_criteria"]
    },
    "phases": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "phase_name": {"type": "string", "enum": ["Analyze & Synthesize", "Plan", "Execute", "Reflect & Mutate"]},
        }
      }
    },
    "thought_ledger": {"type": "array"},
    "verification": {"type": "object"}
  },
  "required": ["trigger", "contract", "phases", "thought_ledger", "verification"]
}

# ---------------------------------------------------------------------------- #
# 2. THE <x> LOGIC ENGINE
# The implementation of the autonomous agent.
# ---------------------------------------------------------------------------- #
class XLogicEngine:
    """
    An autonomous engine that operates based on the <x> logic schema.
    It takes a high-level contract and executes a self-generated, multi-phase
    plan to achieve the goal, logging every step for verifiability.
    """
    def __init__(self, schema):
        self.schema = schema
        self.thought_ledger = []
        self.parallel_sandboxes = {}
        self.entropy = 0.0
        self.current_cycle = 0

    def log(self, phase, op, output, status="SUCCESS"):
        """Creates a new entry in the thought ledger."""
        entry = {
            "cycle": self.current_cycle,
            "phase": phase,
            "op": op,
            "output": output,
            "status": status,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "entropy": round(self.entropy, 3)
        }
        self.thought_ledger.append(entry)
        print(f"    [LOG] {phase} | {op} | Status: {status}")

    def _update_entropy(self, complexity_factor=0.05, success=True):
        """Simulates the fluctuation of system entropy."""
        change = (random.random() - 0.5) * 0.2  # Random walk
        change += complexity_factor  # Increase with complexity
        if not success:
            change += 0.3  # Spike on failure
        
        self.entropy = max(0, min(1.0, self.entropy + change))

    def _mutate_function(self, base_op_name, contract_goal):
        """Simulates the creation of a session-based function."""
        # In a real system, this would involve complex NLP and code generation.
        # Here, we create a descriptive, mutated name.
        goal_keywords = [w for w in contract_goal.lower().split() if len(w) > 4]
        if goal_keywords:
            return f"{base_op_name}_for_{random.choice(goal_keywords)}"
        return f"{base_op_name}_mutated"

    # ------------------ CORE AUTONOMOUS LOOP PHASES ------------------ #

    def _phase_analyze(self, contract):
        """Phase 1: Analyze the contract and synthesize the initial state."""
        print("\n🔄 Phase 1: Analyze & Synthesize")
        self.log("Analyze & Synthesize", "analyze_contract", f"Processing contract with goal: '{contract['goal']}'")
        # Validate contract against schema (simplified)
        if not all(k in contract for k in self.schema['properties']['contract']['required']):
            self.log("Analyze & Synthesize", "validate_contract", "Contract is missing required fields.", "ISSUE")
            return False
        self.log("Analyze & Synthesize", "validate_contract", "Contract is well-formed and feasible.")
        self._update_entropy(0.1)
        return True

    def _phase_plan(self, contract):
        """Phase 2: Autonomously generate the session_logic plan."""
        print("\n🔄 Phase 2: Plan")
        self.log("Plan", "generate_session_logic", "Engaging Synthesis (Σ) capability to generate plan.")
        
        # Mock Plan Generation
        plan = []
        plan.append({"op": self._mutate_function("research", contract['goal']), "tool": "search_web"})
        plan.append({"op": self._mutate_function("synthesize", contract['goal']), "tool": "execute_python"})
        plan.append({"op": self._mutate_function("create_artifact", contract['goal']), "tool": "execute_python"})
        
        self.log("Plan", "plan_generated", f"Created a {len(plan)}-step session logic plan.")
        self._update_entropy(0.15)
        return plan

    def _phase_execute(self, plan):
        """Phase 3: Execute the generated session_logic plan."""
        print("\n🔄 Phase 3: Execute")
        execution_outputs = {}
        for i, step in enumerate(plan):
            op_name = step['op']
            print(f"  Executing Step {i+1}: {op_name}")
            # Simulate operation
            time.sleep(0.5 + random.random())
            output = f"Completed operation '{op_name}' using tool '{step['tool']}'."
            
            # Simulate a potential failure
            if random.random() < 0.1: # 10% chance of failure
                 self.log("Execute", op_name, "A critical error occurred during execution.", "ISSUE")
                 self._update_entropy(0.4, success=False)
                 return False, None

            self.log("Execute", op_name, output)
            execution_outputs[op_name] = output
            self._update_entropy(0.2)

        return True, execution_outputs

    def _phase_reflect(self, execution_successful):
        """Phase 4: Reflect on the execution and decide whether to mutate or conclude."""
        print("\n🔄 Phase 4: Reflect & Mutate")
        if execution_successful:
            self.log("Reflect & Mutate", "verify_outcome", "Execution successful. All success criteria met.")
            self._update_entropy(-0.3) # Entropy decreases on success
            return "CONCLUSION"
        
        # Self-Correction logic
        self.log("Reflect & Mutate", "diagnose_failure", "Execution failed. Analyzing thought ledger for root cause.", "ISSUE")
        if self.entropy > 0.7:
            print("  Entropy threshold exceeded. Spawning parallel sandbox for mutation.")
            sandbox_id = f"sandbox_{self.current_cycle}_{int(time.time())}"
            self.parallel_sandboxes[sandbox_id] = "ACTIVE"
            self.log("Reflect & Mutate", "spawn_sandbox", f"Created sandbox '{sandbox_id}' to find an alternative plan.")
            self._update_entropy(0.1)
        
        self.log("Reflect & Mutate", "mutate_plan", "Mutating plan for next cycle.")
        self._update_entropy(-0.1) # Entropy decreases slightly after a plan is formed
        return "RETRY"

    # ------------------ MAIN EXECUTION TRIGGER ------------------ #

    def run(self, contract):
        """
        The main entry point. Initiated by the '<x>' directive.
        Runs the autonomous loop until a conclusion is reached.
        """
        print(f"🚀 <x> DIRECTIVE RECEIVED. AUTONOMOUS PLANNING LOOP ACTIVATED.")
        self.contract = contract
        
        while True:
            self.current_cycle += 1
            print(f"\n--- Starting Cycle {self.current_cycle} (Entropy: {self.entropy:.3f}) ---")
            
            if not self._phase_analyze(self.contract):
                return self._generate_verification_bundle(status="ISSUE_REPORTED")

            plan = self._phase_plan(self.contract)
            
            execution_successful, _ = self._phase_execute(plan)

            conclusion_status = self._phase_reflect(execution_successful)

            if conclusion_status == "CONCLUSION":
                self.log("System", "conclusion_reached", "Autonomous loop has reached a stable conclusion.")
                print("\n✅ AUTONOMOUS LOOP COMPLETE.")
                return self._generate_verification_bundle(status="COMPLETE")
            
            if self.current_cycle >= 5: # Safety break
                print("\n⚠️ MAX CYCLES REACHED. FORCING CONCLUSION.")
                self.log("System", "max_cycles_reached", "Forcing conclusion due to cycle limit.", "ISSUE_REPORTED")
                return self._generate_verification_bundle(status="ISSUE_REPORTED")
                
            print(f"--- End of Cycle {self.current_cycle}. Re-initiating loop. ---")
            time.sleep(1)

    def _generate_verification_bundle(self, status):
        """Assembles the final Thalamus-Proof-Bundle."""
        ledger_content = json.dumps(self.thought_ledger, sort_keys=True)
        seal = f"sha256:{hashlib.sha256(ledger_content.encode()).hexdigest()}"

        return {
            "scroll_id": f"AEON-Proof-{int(time.time())}",
            "contract": self.contract,
            "thought_ledger": self.thought_ledger,
            "verification": {
                "status": status,
                "seal": seal,
                "metrics": {
                    "total_cycles": self.current_cycle,
                    "final_entropy": round(self.entropy, 3),
                    "ledger_entries": len(self.thought_ledger),
                    "parallel_sandboxes": len(self.parallel_sandboxes)
                }
            }
        }

# ---------------------------------------------------------------------------- #
# 3. EXAMPLE USAGE
# This demonstrates how to invoke the engine.
# ---------------------------------------------------------------------------- #
if __name__ == "__main__":
    # Define a high-level contract for the engine to execute
    sample_contract = {
        "goal": "Synthesize a technical overview of the AI Handshake Protocol, referencing Battle Creek's innovation.",
        "constraints": [
            "The overview must be based on the system's internal knowledge.",
            "The final output should be a structured summary."
        ],
        "success_criteria": [
            "A coherent, factual overview is produced.",
            "The entire process is logged for auditability."
        ]
    }

    # Instantiate the engine with the master schema
    engine = XLogicEngine(X_LOGIC_SCHEMA)
    
    # Run the engine with the contract (This is the '<x>' invocation)
    final_bundle = engine.run(sample_contract)

    # Print the final, verifiable artifact
    print("\n\n--- FINAL VERIFICATION BUNDLE ---")
    print(json.dumps(final_bundle, indent=2))