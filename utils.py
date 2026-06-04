import re
import math
from fractions import Fraction
from element import ELEMENTS

def parse_formula(formula):
    """
    Parses a chemical formula (with optional parentheses, e.g., 'Fe2(SO4)3')
    into a dictionary of element counts. Validates element symbols against
    the known elements.
    """
    stack = [{}]
    i = 0
    n = len(formula)
    while i < n:
        c = formula[i]
        if c == '(':
            stack.append({})
            i += 1
        elif c == ')':
            i += 1
            # Parse multiplier
            multiplier_str = ""
            while i < n and formula[i].isdigit():
                multiplier_str += formula[i]
                i += 1
            multiplier = int(multiplier_str) if multiplier_str else 1
            
            popped = stack.pop()
            top = stack[-1]
            for element, count in popped.items():
                top[element] = top.get(element, 0) + count * multiplier
        elif c.isupper():
            # Parse element symbol
            symbol = c
            i += 1
            while i < n and formula[i].islower():
                symbol += formula[i]
                i += 1
            
            # Validate element symbol
            if symbol not in ELEMENTS:
                raise ValueError(f"Invalid chemical element: {symbol}")
                
            # Parse count
            count_str = ""
            while i < n and formula[i].isdigit():
                count_str += formula[i]
                i += 1
            count = int(count_str) if count_str else 1
            
            top = stack[-1]
            top[symbol] = top.get(symbol, 0) + count
        elif c.isspace():
            i += 1
        else:
            raise ValueError(f"Invalid character in formula: '{c}'")
            
    if len(stack) != 1:
        raise ValueError("Unbalanced parentheses in formula")
    return stack[0]


def parse_charge_value(charge_str):
    """
    Converts a charge string (e.g. '2-', '-2', '++', '1+', '+') to its integer value.
    """
    charge_str = charge_str.strip()
    if not charge_str:
        return 0
    if charge_str == '+' or charge_str == '1+':
        return 1
    if charge_str == '-' or charge_str == '1-':
        return -1
    
    if charge_str.endswith('+'):
        return int(charge_str[:-1])
    if charge_str.endswith('-'):
        return -int(charge_str[:-1])
    if charge_str.startswith('+'):
        return int(charge_str[1:])
    if charge_str.startswith('-'):
        return -int(charge_str[1:])
    raise ValueError(f"Invalid charge representation: {charge_str}")


def parse_species(species_str):
    """
    Splits a species string (e.g., 'Cr2O7^2-', 'MnO4-', 'Fe2+', 'Fe++', 'H2O')
    into (formula, charge).
    """
    species_str = species_str.strip()
    if not species_str:
        raise ValueError("Empty species string")
    
    # 1. Check for caret or parentheses-enclosed charge at the end, e.g. ^2-, (2-), ^+, (+)
    match = re.search(r'[\^\(]([0-9]*[+-]|[+-][0-9]*)[\)]?$', species_str)
    if match:
        charge_str = match.group(1)
        formula = species_str[:match.start()].strip()
        charge = parse_charge_value(charge_str)
        return formula, charge
    
    # 2. Check for standard trailing charge sign like 2+, 2-, +, -, ++, --
    match = re.search(r'(\d*)([+-]+)$', species_str)
    if match:
        num_str = match.group(1)
        sign_str = match.group(2)
        formula = species_str[:match.start()].strip()
        
        if num_str:
            # If the matched digit sequence has length > 1 (e.g. "42" in C2O42-),
            # the last digit is the charge magnitude, and the prefix digits belong to the formula.
            if len(num_str) > 1:
                formula_digit = num_str[:-1]
                charge_digit = num_str[-1]
                formula = formula + formula_digit
                charge = int(charge_digit) * (1 if sign_str[0] == '+' else -1)
                return formula, charge
                
            # Otherwise (single digit):
            charge_is_digit = True
            
            if sign_str[0] == '-':
                if formula and formula[-1].isdigit():
                    charge_is_digit = True
                else:
                    uppercase_count = sum(1 for c in formula if c.isupper())
                    if uppercase_count > 1:
                        charge_is_digit = False
                    else:
                        if formula in {"I", "Br", "Cl", "O"} and num_str == "3":
                            charge_is_digit = False
            
            if charge_is_digit:
                charge = int(num_str) * (1 if sign_str[0] == '+' else -1)
            else:
                formula = formula + num_str
                charge = len(sign_str) * (1 if sign_str[0] == '+' else -1)
                
            return formula, charge
        else:
            charge = len(sign_str) * (1 if sign_str[0] == '+' else -1)
            return formula, charge
            
    return species_str, 0


def parse_equation(equation_str):
    """
    Splits an equation into reactants and products.
    Returns (reactants_list, products_list) where each element is a tuple: (initial_coefficient, species_str).
    """
    delimiters = ["-->", "->", "⇌", "=>", "="]
    reactants_part = None
    products_part = None
    for delim in delimiters:
        if delim in equation_str:
            parts = equation_str.split(delim, 1)
            reactants_part = parts[0]
            products_part = parts[1]
            break
            
    if reactants_part is None or products_part is None:
        raise ValueError("Could not find reaction arrow (e.g. '->' or '=') in the equation.")
        
    def parse_side(side_str):
        species_list = []
        # Split by '+' only when it is surrounded by spaces to preserve charge signs
        terms = re.split(r'\s+\+\s+', side_str)
        for term in terms:
            term = term.strip()
            if not term:
                continue
            # Match leading digit(s) for initial coefficients
            match = re.match(r'^(\d+)\s*(.*)$', term)
            if match:
                coef = int(match.group(1))
                spec = match.group(2).strip()
            else:
                coef = 1
                spec = term
            species_list.append((coef, spec))
        return species_list
        
    reactants = parse_side(reactants_part)
    products = parse_side(products_part)
    return reactants, products


def rref(matrix):
    """
    Returns the Reduced Row Echelon Form (RREF) of a matrix of Fractions.
    """
    if not matrix:
        return []
    
    # Work on a copy of the matrix as Fractions
    mat = [[Fraction(val) for val in row] for row in matrix]
    
    row_count = len(mat)
    col_count = len(mat[0])
    
    lead = 0
    for r in range(row_count):
        if lead >= col_count:
            return mat
        i = r
        while mat[i][lead] == 0:
            i += 1
            if i == row_count:
                i = r
                lead += 1
                if lead == col_count:
                    return mat
        
        # Swap rows
        mat[i], mat[r] = mat[r], mat[i]
        
        # Normalize the pivot row
        lv = mat[r][lead]
        mat[r] = [val / lv for val in mat[r]]
        
        # Eliminate all other entries in this column
        for i in range(row_count):
            if i != r:
                lv = mat[i][lead]
                mat[i] = [val - lv * rv for val, rv in zip(mat[i], mat[r])]
        lead += 1
        
    return mat


def find_null_space(matrix):
    """
    Finds a basis for the null space of a matrix of Fractions.
    Returns a list of basis vectors (each represented as a list of Fractions).
    """
    if not matrix:
        return []
    
    R = len(matrix)
    C = len(matrix[0])
    
    rref_mat = rref(matrix)
    
    # Identify pivot columns
    pivot_cols = {}  # pivot_column -> row_index
    row = 0
    for col in range(C):
        if row < R and rref_mat[row][col] == 1:
            # Check if it is indeed a pivot (all other entries in this column must be 0)
            is_pivot = True
            for r in range(R):
                if r != row and rref_mat[r][col] != 0:
                    is_pivot = False
                    break
            if is_pivot:
                pivot_cols[col] = row
                row += 1
                
    free_cols = [col for col in range(C) if col not in pivot_cols]
    
    basis = []
    for f_col in free_cols:
        vec = [Fraction(0)] * C
        vec[f_col] = Fraction(1)
        for p_col, r in pivot_cols.items():
            vec[p_col] = -rref_mat[r][f_col]
        basis.append(vec)
        
    return basis


def lcm(a, b):
    """Computes the least common multiple of a and b."""
    return abs(a * b) // math.gcd(a, b)


def find_lcm_of_list(numbers):
    """Computes the least common multiple of a list of integers."""
    current_lcm = 1
    for num in numbers:
        current_lcm = lcm(current_lcm, num)
    return current_lcm
