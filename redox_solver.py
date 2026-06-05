import sys
from reaction import Reaction

class RedoxSolver:
    """
    Main solver class for balancing and analyzing redox reactions.
    """
    def balance_reaction(self, reaction_str, medium=None):
        """
        Balances the given reaction string in the specified medium.
        If medium is None, auto-detects.
        """
        rxn = Reaction(reaction_str, medium)
        return rxn.balance()
        
    def analyze_reaction(self, reaction_str, medium=None):
        """
        Balances and performs detailed redox analysis on the reaction.
        """
        rxn = Reaction(reaction_str, medium)
        return rxn.analyze()


# Colors for the CLI
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def print_banner():
    banner = f"""
{Colors.HEADER}======================================================================
{Colors.BOLD}⚡ Redox Reaction Solver & Analyzer ⚡
{Colors.END}{Colors.HEADER}======================================================================{Colors.END}
"""
    print(banner)


def format_ox_state(val):
    if val > 0:
        return f"+{val}"
    return str(val)


def run_cli():
    print_banner()
    
    while True:
        try:
            equation = input(f"{Colors.BOLD}Enter reaction equation{Colors.END} (e.g., MnO4- + Fe2+ -> Mn2+ + Fe3+) or 'q' to quit:\n> ").strip()
            if not equation:
                continue
            if equation.lower() == 'q':
                print(f"\n{Colors.GREEN}Thank you for using Redox Solver! Goodbye.{Colors.END}")
                break
                
            print(f"\n{Colors.BOLD}Select Medium:{Colors.END}")
            print("1. Auto-detect (tries Neutral, then Acidic, then Basic) [Default]")
            print("2. Acidic (adds H+ and H2O)")
            print("3. Basic (adds OH- and H2O)")
            print("4. Neutral (no extra species)")
            
            medium_choice = input("Choice [1-4]: ").strip()
            
            medium = None
            if medium_choice == '2':
                medium = 'acidic'
            elif medium_choice == '3':
                medium = 'basic'
            elif medium_choice == '4':
                medium = 'neutral'
                
            print(f"\n{Colors.CYAN}Processing reaction...{Colors.END}")
            
            solver = RedoxSolver()
            analysis = solver.analyze_reaction(equation, medium)
            
            # Print balanced equation
            print(f"\n{Colors.GREEN}{Colors.BOLD}======================================================================{Colors.END}")
            print(f"{Colors.GREEN}{Colors.BOLD}SUCCESSFULLY BALANCED ({analysis['medium'].capitalize()} Medium):{Colors.END}")
            print(f"  {Colors.BOLD}{Colors.CYAN}{analysis['balanced_equation']}{Colors.END}")
            print(f"{Colors.GREEN}{Colors.BOLD}======================================================================{Colors.END}\n")
            
            # Print Oxidation States
            print(f"{Colors.BOLD}{Colors.UNDERLINE}Oxidation States Breakdown:{Colors.END}")
            
            print(f"\n  {Colors.BOLD}Reactants:{Colors.END}")
            for spec, states in analysis['reactant_oxidation_states'].items():
                states_str = ", ".join(f"{el}: {Colors.YELLOW}{format_ox_state(val)}{Colors.END}" for el, val in states.items())
                print(f"    - {Colors.BOLD}{spec:<10}{Colors.END} -> {states_str}")
                
            print(f"\n  {Colors.BOLD}Products:{Colors.END}")
            for spec, states in analysis['product_oxidation_states'].items():
                states_str = ", ".join(f"{el}: {Colors.YELLOW}{format_ox_state(val)}{Colors.END}" for el, val in states.items())
                print(f"    - {Colors.BOLD}{spec:<10}{Colors.END} -> {states_str}")
                
            # Print Redox changes
            print(f"\n{Colors.BOLD}{Colors.UNDERLINE}Redox Process Details:{Colors.END}")
            
            if analysis['oxidized_elements']:
                print(f"\n  {Colors.BOLD}{Colors.GREEN}Oxidation (Increase in Oxidation State):{Colors.END}")
                for item in analysis['oxidized_elements']:
                    print(f"    - {Colors.BOLD}{item['element']}{Colors.END} in {Colors.CYAN}{item['from_species']}{Colors.END} is oxidized from "
                          f"{Colors.YELLOW}{format_ox_state(item['from_ox'])}{Colors.END} to "
                          f"{Colors.YELLOW}{format_ox_state(item['to_ox'])}{Colors.END} in {Colors.CYAN}{item['to_species']}{Colors.END}")
                if analysis['oxidation_half_reaction']:
                    print(f"    {Colors.BOLD}Half-Reaction:{Colors.END} {Colors.GREEN}{analysis['oxidation_half_reaction']}{Colors.END}")
            else:
                print(f"\n  {Colors.BOLD}Oxidation:{Colors.END} None detected (no changes)")
                
            if analysis['reduced_elements']:
                print(f"\n  {Colors.BOLD}{Colors.RED}Reduction (Decrease in Oxidation State):{Colors.END}")
                for item in analysis['reduced_elements']:
                    print(f"    - {Colors.BOLD}{item['element']}{Colors.END} in {Colors.CYAN}{item['from_species']}{Colors.END} is reduced from "
                          f"{Colors.YELLOW}{format_ox_state(item['from_ox'])}{Colors.END} to "
                          f"{Colors.YELLOW}{format_ox_state(item['to_ox'])}{Colors.END} in {Colors.CYAN}{item['to_species']}{Colors.END}")
                if analysis['reduction_half_reaction']:
                    print(f"    {Colors.BOLD}Half-Reaction:{Colors.END} {Colors.RED}{analysis['reduction_half_reaction']}{Colors.END}")
            else:
                print(f"\n  {Colors.BOLD}Reduction:{Colors.END} None detected (no changes)")
                
            # Print Agents
            print(f"\n{Colors.BOLD}{Colors.UNDERLINE}Active Agents:{Colors.END}")
            if analysis['reducing_agents']:
                agents_str = ", ".join(f"{Colors.BOLD}{Colors.GREEN}{a}{Colors.END}" for a in analysis['reducing_agents'])
                print(f"  - {Colors.BOLD}Reducing Agent(s){Colors.END} (source of electrons / gets oxidized): {agents_str}")
            else:
                print(f"  - {Colors.BOLD}Reducing Agent(s){Colors.END}: None")
                
            if analysis['oxidizing_agents']:
                agents_str = ", ".join(f"{Colors.BOLD}{Colors.RED}{a}{Colors.END}" for a in analysis['oxidizing_agents'])
                print(f"  - {Colors.BOLD}Oxidizing Agent(s){Colors.END} (electron acceptor / gets reduced) : {agents_str}")
            else:
                print(f"  - {Colors.BOLD}Oxidizing Agent(s){Colors.END}: None")
                
            print(f"\n{Colors.HEADER}----------------------------------------------------------------------{Colors.END}\n")
            
        except KeyboardInterrupt:
            print(f"\n\n{Colors.GREEN}Thank you for using Redox Solver! Goodbye.{Colors.END}")
            break
        except Exception as e:
            print(f"\n{Colors.RED}{Colors.BOLD}[ERROR] {str(e)}{Colors.END}\n")
            print(f"{Colors.HEADER}----------------------------------------------------------------------{Colors.END}\n")


if __name__ == "__main__":
    run_cli()
