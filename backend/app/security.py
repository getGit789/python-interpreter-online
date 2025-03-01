import re
from typing import List, Optional, Dict, Set, Tuple
import logging

logger = logging.getLogger("python-interpreter")

# Malicious code patterns
MALICIOUS_PATTERNS = [
    # Fork bombs and resource exhaustion
    r"while\s*True.*:.*fork\(\)",
    r"os\.fork\(\)",
    r"multiprocessing\.Process",
    r"threading\.Thread",
    r"concurrent\.futures",
    
    # Infinite loops with no sleep/delay
    r"while\s*True\s*:",
    r"while\s*1\s*:",
    r"for\s*.*\s*in\s*itertools\.cycle",
    
    # Network scanning/probing
    r"socket\.connect\(\s*\(\s*['\"]\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}['\"]",
    r"scapy",
    r"nmap",
    
    # Crypto mining
    r"hashlib\.sha256.*while\s*True",
    r"mining",
    r"bitcoin",
    r"ethereum",
    
    # Data exfiltration
    r"requests\.post\(\s*['\"]https?://",
    r"urllib\.request\.urlopen\(\s*['\"]https?://",
    
    # Command execution
    r"subprocess\.(?:call|run|Popen)",
    r"os\.system\(",
    r"os\.popen\(",
    r"commands\.getoutput\(",
    
    # File system operations
    r"os\.(?:remove|unlink|rmdir|mkdir)",
    r"shutil\.(?:rmtree|copy)",
    
    # Code injection
    r"exec\s*\(",
    r"eval\s*\(",
    r"compile\s*\(",
    r"__import__\s*\(",
    
    # Shell code
    r"\\x[0-9a-fA-F]{2}",
    r"shellcode",
    
    # Privilege escalation
    r"os\.setuid\(",
    r"os\.setgid\(",
    r"ctypes\.CDLL\(",
]

# Benign patterns that might be falsely flagged
BENIGN_EXCEPTIONS = [
    # Common while True patterns with proper delays
    r"while\s*True.*:.*time\.sleep\(",
    r"while\s*True.*:.*await\s+asyncio\.sleep\(",
]

class CodeScanner:
    def __init__(self):
        # Compile regex patterns for efficiency
        self.malicious_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in MALICIOUS_PATTERNS]
        self.benign_exceptions = [re.compile(pattern, re.IGNORECASE) for pattern in BENIGN_EXCEPTIONS]
        
        # Honeypot detection
        self.honeypot_triggers: Set[str] = set()
        
    def is_malicious(self, code: str) -> Tuple[bool, Optional[str]]:
        """
        Scan code for malicious patterns
        Returns (is_malicious, reason)
        """
        # Check for infinite loops with proper delay (benign)
        benign_matches = []
        for pattern in self.benign_exceptions:
            if pattern.search(code):
                benign_matches.append(pattern.pattern)
        
        # Check for malicious patterns
        for pattern in self.malicious_patterns:
            if pattern.search(code):
                pattern_str = pattern.pattern
                
                # If this pattern has a benign exception that was matched, skip it
                if any(be for be in benign_matches if pattern_str in be):
                    continue
                    
                reason = f"Potentially harmful code pattern detected: {pattern_str}"
                logger.warning(f"Malicious pattern detected: {pattern_str}")
                return True, reason
        
        # Check for honeypot triggers
        for trigger in self.honeypot_triggers:
            if trigger in code:
                logger.critical(f"Honeypot trigger detected: {trigger}")
                return True, "Security system triggered"
        
        return False, None
    
    def add_honeypot_trigger(self, trigger: str):
        """Add a new honeypot trigger"""
        self.honeypot_triggers.add(trigger)
    
    def update_malicious_patterns(self, new_patterns: List[str]):
        """Update the list of malicious patterns"""
        for pattern in new_patterns:
            self.malicious_patterns.append(re.compile(pattern, re.IGNORECASE))

# Create a singleton instance
code_scanner = CodeScanner()

# Add some honeypot triggers
code_scanner.add_honeypot_trigger("__honeypot__")
code_scanner.add_honeypot_trigger("get_system_info()")
code_scanner.add_honeypot_trigger("hack_system()")

def scan_code(code: str) -> Tuple[bool, Optional[str]]:
    """
    Scan code for malicious patterns
    Returns (is_safe, reason_if_not_safe)
    """
    is_malicious, reason = code_scanner.is_malicious(code)
    return not is_malicious, reason
