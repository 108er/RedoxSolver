import re
import math
from fractions import Fraction
from element import ELEMENTS
from utils import (
    parse_formula,
    parse_species,
    parse_equation,
    find_null_space,
    find_lcm_of_list,
    lcm
)

# Common polyatomic ions and their charges
POLYATOMIC_IONS = {
    # Anions
    "SO4": -2,
    "SO3": -2,
    "HSO4": -1,
    "HSO3": -1,
    "NO3": -1,
    "NO2": -1,
    "PO4": -3,
    "HPO4": -2,
    "H2PO4": -1,
    "CO3": -2,
    "HCO3": -1,
    "OH": -1,
    "ClO4": -1,
    "ClO3": -1,
    "ClO2": -1,
    "ClO": -1,
    "CN": -1,
    "SCN": -1,
    "MnO4": -1,
    "CrO4": -2,
    "Cr2O7": -2,
    "C2O4": -2,
    "CH3COO": -1,
    "C2H3O2": -1,
    # Cations
    "NH4": 1,
}


def split_neutral_compound(formula):
    """
    Attempts to split a neutral compound into a cation and a known polyatomic anion/cation.
    Returns a list of tuples: [(part_formula, charge), ...] or None if no split is found.
    """
    # 1. Check for parenthesis-enclosed group, e.g., A_x(B_y)_z
    match = re.search(r'\(([^)]+)\)(\d*)', formula)
    if match:
        anion_formula = match.group(1)
        multiplier_str = match.group(2)
        z = int(multiplier_str) if multiplier_str else 1
        
        if anion_formula in POLYATOMIC_IONS:
            anion_charge = POLYATOMIC_IONS[anion_formula]
            cation_part = formula[:match.start()].strip()
            cation_counts = parse_formula(cation_part)
            if len(cation_counts) == 1:
                cation_element = list(cation_counts.keys())[0]
                x = list(cation_counts.values())[0]
                # cation_charge * x + anion_charge * z = 0
                cation_charge = -anion_charge * z / x
                return [(cation_element, cation_charge), (anion_formula, anion_charge)]

    # 2. Check if the compound starts with NH4
    if formula.startswith("NH4") and formula != "NH4":
        anion_part = formula[3:]
        return [("NH4", 1), (anion_part, -1)]

    # 3. Check if the compound ends with a known polyatomic anion
    sorted_anions = sorted([k for k, v in POLYATOMIC_IONS.items() if v < 0], key=len, reverse=True)
    for anion in sorted_anions:
        if formula.endswith(anion):
            cation_part = formula[:-len(anion)].strip()
            if cation_part:
                cation_counts = parse_formula(cation_part)
                if len(cation_counts) == 1:
                    cation_element = list(cation_counts.keys())[0]
                    x = list(cation_counts.values())[0]
                    anion_charge = POLYATOMIC_IONS[anion]
                    cation_charge = -anion_charge / x
                    return [(cation_element, cation_charge), (anion, anion_charge)]
                    
    return None


def assign_oxidation_states(formula, charge):
    """
    Calculates the oxidation states of all elements in a species (formula, charge).
    Returns a dictionary of {element_symbol: oxidation_state}.
    """
    counts = parse_formula(formula)
    
    # If only one element in species, its oxidation state is charge / count
    if len(counts) == 1:
        el = list(counts.keys())[0]
        cnt = list(counts.values())[0]
        val = charge / cnt
        return {el: int(val) if val.is_integer() else val}
        
    # If charge is 0, attempt to split into ions first to handle ionic species
    if charge == 0:
        split_parts = split_neutral_compound(formula)
        if split_parts:
            ox_states = {}
            for part_formula, part_charge in split_parts:
                part_ox = assign_oxidation_states(part_formula, part_charge)
                ox_states.update(part_ox)
            return ox_states
            
    # Apply rules
    assigned = {}
    
    # 1. Alkali metals: Li, Na, K, Rb, Cs, Fr -> +1
    alkali_metals = {"Li", "Na", "K", "Rb", "Cs", "Fr"}
    for el in counts:
        if el in alkali_metals:
            assigned[el] = 1
            
    # 2. Alkaline earth metals: Be, Mg, Ca, Sr, Ba, Ra -> +2
    alkaline_earth_metals = {"Be", "Mg", "Ca", "Sr", "Ba", "Ra"}
    for el in counts:
        if el in alkaline_earth_metals:
            assigned[el] = 2
            
    # 3. Fluorine: F -> -1
    if "F" in counts:
        assigned["F"] = -1
        
    # 4. Hydrogen: H
    if "H" in counts:
        other_elements = [el for el in counts if el != "H"]
        is_metal_hydride = True
        for el in other_elements:
            element_obj = ELEMENTS.get(el)
            if element_obj and element_obj.electronegativity is not None and element_obj.electronegativity >= 1.8:
                is_metal_hydride = False
                break
        if is_metal_hydride and other_elements:
            assigned["H"] = -1
        else:
            assigned["H"] = 1
            
    # 5. Oxygen: O
    if "O" in counts and "O" not in assigned:
        is_peroxide = False
        is_superoxide = False
        other_elements = [el for el in counts if el != "O"]
        if len(other_elements) == 1:
            other_el = other_elements[0]
            other_cnt = counts[other_el]
            o_cnt = counts["O"]
            if other_el in alkali_metals and other_cnt == 2 and o_cnt == 2:
                is_peroxide = True
            elif other_el == "H" and other_cnt == 2 and o_cnt == 2:
                is_peroxide = True
            elif other_el in alkaline_earth_metals and other_cnt == 1 and o_cnt == 2:
                is_peroxide = True
            elif other_el in alkali_metals and other_cnt == 1 and o_cnt == 2:
                is_superoxide = True
                
        if is_peroxide:
            assigned["O"] = -1
        elif is_superoxide:
            assigned["O"] = -0.5
        else:
            assigned["O"] = -2
            
    # 6. Solve if there is exactly 1 element left unassigned
    unassigned = [el for el in counts if el not in assigned]
    if len(unassigned) == 1:
        el = unassigned[0]
        cnt = counts[el]
        assigned_sum = sum(assigned[x] * counts[x] for x in assigned)
        val = (charge - assigned_sum) / cnt
        assigned[el] = int(val) if val.is_integer() else val
        return assigned
        
    # 7. If multiple elements are left unassigned, assign by electronegativity
    preferred_negative = {
        "F": -1, "O": -2, "Cl": -1, "Br": -1, "I": -1,
        "S": -2, "Se": -2, "Te": -2, "N": -3, "P": -3, "As": -3
    }
    
    remaining_elements = sorted(
        unassigned,
        key=lambda x: ELEMENTS[x].electronegativity if ELEMENTS[x].electronegativity is not None else 0,
        reverse=True
    )
    
    for idx, el in enumerate(remaining_elements):
        if idx == len(remaining_elements) - 1:
            cnt = counts[el]
            assigned_sum = sum(assigned[x] * counts[x] for x in assigned)
            val = (charge - assigned_sum) / cnt
            assigned[el] = int(val) if val.is_integer() else val
        else:
            if el in preferred_negative:
                assigned[el] = preferred_negative[el]
            else:
                ox_nums = ELEMENTS[el].oxidation_numbers
                neg_ox = [x for x in ox_nums if x < 0]
                if neg_ox:
                    assigned[el] = neg_ox[0]
                else:
                    assigned[el] = 0
                    
    return assigned


def simplify_coefficients(coeffs):
    """Simplifies a list of integer coefficients by their greatest common divisor."""
    if not coeffs:
        return coeffs
    g = abs(coeffs[0])
    for c in coeffs[1:]:
        g = math.gcd(g, abs(c))
    if g > 1:
        return [c // g for c in coeffs]
    return coeffs


class Reaction:
    def __init__(self, equation_str, medium=None):
        self.raw_equation = equation_str
        self.medium = medium  # 'acidic', 'basic', 'neutral', or None (auto-detect)
        
        # Parse equations into reactants and products lists
        # Each list contains tuples: (coefficient, species_str)
        self.reactants_parsed, self.products_parsed = parse_equation(equation_str)
        
        # Original species strings
        self.orig_reactants = [item[1] for item in self.reactants_parsed]
        self.orig_products = [item[1] for item in self.products_parsed]
        
        # Validate that we have species
        if not self.orig_reactants or not self.orig_products:
            raise ValueError("Equation must have at least one reactant and one product.")
            
        # Balanced state
        self.balanced_reactants = [] # list of (coef, species_str)
        self.balanced_products = []  # list of (coef, species_str)
        self.is_balanced = False
        
    def _balance_with_medium(self, medium):
        """
        Attempts to balance the reaction using a specific medium.
        Returns a tuple of (reactants_list, products_list) or None if not balanceable.
        """
        # Parse original reactants and products into (formula, charge, element_counts)
        r_info = []
        for spec in self.orig_reactants:
            f, ch = parse_species(spec)
            r_info.append((f, ch, parse_formula(f)))
            
        p_info = []
        for spec in self.orig_products:
            f, ch = parse_species(spec)
            p_info.append((f, ch, parse_formula(f)))
            
        # Define extra species based on medium
        extra_info = []
        if medium == "acidic":
            # H+ and H2O
            extra_info.append(("H", 1, {"H": 1}))
            extra_info.append(("H2O", 0, {"H": 2, "O": 1}))
        elif medium == "basic":
            # OH- and H2O
            extra_info.append(("OH", -1, {"O": 1, "H": 1}))
            extra_info.append(("H2O", 0, {"H": 2, "O": 1}))
            
        # Solve system
        a = len(r_info)
        b = len(p_info)
        e = len(extra_info)
        
        # Collect elements
        elements = set()
        for _, _, counts in r_info + p_info + extra_info:
            elements.update(counts.keys())
        elements = sorted(list(elements))
        
        # Verify element matching
        # Non-H/O elements must be on both sides of the original equation
        orig_r_elements = set()
        for _, _, counts in r_info:
            orig_r_elements.update(counts.keys())
        orig_p_elements = set()
        for _, _, counts in p_info:
            orig_p_elements.update(counts.keys())
            
        non_ho_r = orig_r_elements - {"H", "O"}
        non_ho_p = orig_p_elements - {"H", "O"}
        if non_ho_r != non_ho_p:
            # Elements other than H and O do not match on both sides
            return None
            
        # Build matrix
        num_rows = len(elements) + 1
        num_cols = a + b + e
        matrix = [[Fraction(0)] * num_cols for _ in range(num_rows)]
        
        for r, el in enumerate(elements):
            for i in range(a):
                matrix[r][i] = Fraction(r_info[i][2].get(el, 0))
            for j in range(b):
                matrix[r][a + j] = Fraction(-p_info[j][2].get(el, 0))
            for k in range(e):
                matrix[r][a + b + k] = Fraction(extra_info[k][2].get(el, 0))
                
        # Charge balance row
        r_charge = len(elements)
        for i in range(a):
            matrix[r_charge][i] = Fraction(r_info[i][1])
        for j in range(b):
            matrix[r_charge][a + j] = Fraction(-p_info[j][1])
        for k in range(e):
            matrix[r_charge][a + b + k] = Fraction(extra_info[k][1])
            
        basis = find_null_space(matrix)
        if not basis:
            return None
            
        # Search for a positive solution
        d = len(basis)
        best_solution = None
        min_coef_sum = float('inf')
        
        if d == 1:
            ranges = [[1], [-1]]
        else:
            import itertools
            ranges = itertools.product(range(-15, 16), repeat=d)
            
        for combo in ranges:
            if all(x == 0 for x in combo) if d > 1 else False:
                continue
                
            if d == 1:
                vec = [combo[0] * val for val in basis[0]]
            else:
                vec = [Fraction(0)] * num_cols
                for j, weight in enumerate(combo):
                    if weight != 0:
                        for idx in range(num_cols):
                            vec[idx] += weight * basis[j][idx]
                            
            if all(val > 0 for val in vec[:a+b]):
                sign = 1
            elif all(val < 0 for val in vec[:a+b]):
                sign = -1
            else:
                continue
                
            v = [sign * val for val in vec]
            
            denominators = [val.denominator for val in v]
            lcm_val = find_lcm_of_list(denominators)
            integer_v = [int(val * lcm_val) for val in v]
            
            if any(coef <= 0 for coef in integer_v[:a+b]):
                continue
                
            coef_sum = sum(abs(coef) for coef in integer_v)
            if coef_sum < min_coef_sum:
                min_coef_sum = coef_sum
                best_solution = integer_v
                
        if not best_solution:
            return None
            
        # Simplify coefficients by dividing by GCD
        best_solution = simplify_coefficients(best_solution)
        
        # Partition reactants and products
        reactants_res = []
        for i in range(a):
            reactants_res.append((best_solution[i], self.orig_reactants[i]))
            
        products_res = []
        for j in range(b):
            products_res.append((best_solution[a + j], self.orig_products[j]))
            
        # Handle extra species
        if medium == "acidic":
            # H+
            h_coef = best_solution[a + b]
            if h_coef > 0:
                reactants_res.append((h_coef, "H+"))
            elif h_coef < 0:
                products_res.append((-h_coef, "H+"))
            # H2O
            w_coef = best_solution[a + b + 1]
            if w_coef > 0:
                reactants_res.append((w_coef, "H2O"))
            elif w_coef < 0:
                products_res.append((-w_coef, "H2O"))
        elif medium == "basic":
            # OH-
            oh_coef = best_solution[a + b]
            if oh_coef > 0:
                reactants_res.append((oh_coef, "OH-"))
            elif oh_coef < 0:
                products_res.append((-oh_coef, "OH-"))
            # H2O
            w_coef = best_solution[a + b + 1]
            if w_coef > 0:
                reactants_res.append((w_coef, "H2O"))
            elif w_coef < 0:
                products_res.append((-w_coef, "H2O"))
                
        # Combine duplicates if any (e.g. if H2O is already reactant/product)
        def merge_duplicates(species_list):
            merged = {}
            for coef, spec in species_list:
                # Normalize species string to match duplicates, e.g. H2O vs H2O
                # We can strip charge spaces
                norm = spec.strip()
                merged[norm] = merged.get(norm, 0) + coef
            return [(v, k) for k, v in merged.items() if v > 0]
            
        return merge_duplicates(reactants_res), merge_duplicates(products_res)

    def balance(self):
        """
        Balances the reaction in the configured medium. Auto-detects if medium is None.
        Updates self.balanced_reactants, self.balanced_products, self.is_balanced.
        Returns the balanced reaction string.
        """
        if self.medium is not None:
            res = self._balance_with_medium(self.medium)
            if res:
                self.balanced_reactants, self.balanced_products = res
                self.is_balanced = True
            else:
                raise ValueError(f"Could not balance reaction in {self.medium} medium.")
        else:
            # Auto-detect: try neutral, then acidic, then basic
            for med in ["neutral", "acidic", "basic"]:
                res = self._balance_with_medium(med)
                if res:
                    self.balanced_reactants, self.balanced_products = res
                    self.medium = med
                    self.is_balanced = True
                    break
            if not self.is_balanced:
                raise ValueError("Could not balance reaction in any medium.")
                
        return self.get_balanced_equation_str()

    def get_balanced_equation_str(self):
        """Returns the formatted balanced reaction string."""
        if not self.is_balanced:
            return "Reaction not balanced yet."
            
        def format_side(species_list):
            terms = []
            for coef, spec in species_list:
                coef_str = f"{coef} " if coef > 1 else ""
                terms.append(f"{coef_str}{spec}")
            return " + ".join(terms)
            
        arrow = " -> "
        if "⇌" in self.raw_equation:
            arrow = " ⇌ "
        elif "=>" in self.raw_equation:
            arrow = " => "
        elif "=" in self.raw_equation:
            arrow = " = "
            
        return format_side(self.balanced_reactants) + arrow + format_side(self.balanced_products)

    def analyze(self):
        """
        Performs detailed redox analysis on the reaction.
        Must be balanced first.
        Returns a dictionary containing:
        - 'balanced_equation': balanced string
        - 'medium': medium used
        - 'reactant_oxidation_states': dict of {species: {element: ox}}
        - 'product_oxidation_states': dict of {species: {element: ox}}
        - 'oxidized_elements': list of dicts with details
        - 'reduced_elements': list of dicts with details
        - 'oxidizing_agent': str species
        - 'reducing_agent': str species
        """
        if not self.is_balanced:
            self.balance()
            
        # Calculate oxidation states for all species on reactants and products side
        reactants_ox = {}
        for _, spec in self.balanced_reactants:
            f, ch = parse_species(spec)
            reactants_ox[spec] = assign_oxidation_states(f, ch)
            
        products_ox = {}
        for _, spec in self.balanced_products:
            f, ch = parse_species(spec)
            products_ox[spec] = assign_oxidation_states(f, ch)
            
        # Map each element to its states in reactants and products
        # element -> { species: ox_state }
        el_reactants = {}
        for spec, oxs in reactants_ox.items():
            for el, val in oxs.items():
                if el not in el_reactants:
                    el_reactants[el] = {}
                el_reactants[el][spec] = val
                
        el_products = {}
        for spec, oxs in products_ox.items():
            for el, val in oxs.items():
                if el not in el_products:
                    el_products[el] = {}
                el_products[el][spec] = val
                
        oxidized_elements = []
        reduced_elements = []
        
        # Compare elements to find changes
        # We look for matches of elements in reactants and products
        for el in el_reactants:
            if el in el_products:
                # Find all pairs of changes
                for r_spec, r_ox in el_reactants[el].items():
                    for p_spec, p_ox in el_products[el].items():
                        # We ignore H and O changes if they are just from H2O/H+/OH-
                        # unless it's a real redox change of H/O (like H2 + O2 -> H2O).
                        # Let's count them if they actually changed oxidation state.
                        if r_ox != p_ox:
                            change = {
                                'element': el,
                                'from_species': r_spec,
                                'from_ox': r_ox,
                                'to_species': p_spec,
                                'to_ox': p_ox
                            }
                            if p_ox > r_ox:
                                # Avoid duplicating if we have multiple reactants/products
                                if change not in oxidized_elements:
                                    oxidized_elements.append(change)
                            else:
                                if change not in reduced_elements:
                                    reduced_elements.append(change)
                                    
        # Identify agents
        # Oxidizing agent: reactant species containing the element that is reduced
        # Reducing agent: reactant species containing the element that is oxidized
        oxidizing_agents = set()
        reducing_agents = set()
        
        for item in reduced_elements:
            # We exclude standard medium additions like H+ or OH- or H2O from being the main agents
            # unless there are no other options.
            oxidizing_agents.add(item['from_species'])
            
        for item in oxidized_elements:
            reducing_agents.add(item['from_species'])
            
        # Refine agents (exclude H+, OH-, H2O if possible)
        def clean_agents(agents_set):
            filtered = {a for a in agents_set if a not in {"H+", "OH-", "H2O"}}
            if filtered:
                return sorted(list(filtered))
            return sorted(list(agents_set))
            
        ox_agents = clean_agents(oxidizing_agents)
        red_agents = clean_agents(reducing_agents)
        
        return {
            'balanced_equation': self.get_balanced_equation_str(),
            'medium': self.medium,
            'reactant_oxidation_states': reactants_ox,
            'product_oxidation_states': products_ox,
            'oxidized_elements': oxidized_elements,
            'reduced_elements': reduced_elements,
            'oxidizing_agents': ox_agents,
            'reducing_agents': red_agents
        }
