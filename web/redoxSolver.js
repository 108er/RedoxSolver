// Redox Solver Chemistry Engine & UI Controller

// 1. Elements Database (Extracted from data.csv)
const ELEMENTS = {"H": {"name": "Hydrogen", "electronegativity": 2.2, "oxidation_numbers": [-1, 0, 1]}, "He": {"name": "Helium", "electronegativity": null, "oxidation_numbers": [0]}, "Li": {"name": "Lithium", "electronegativity": 0.98, "oxidation_numbers": [0, 1]}, "Be": {"name": "Beryllium", "electronegativity": 1.57, "oxidation_numbers": [0, 2]}, "B": {"name": "Boron", "electronegativity": 2.04, "oxidation_numbers": [0, 1, 2, 3]}, "C": {"name": "Carbon", "electronegativity": 2.55, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4]}, "N": {"name": "Nitrogen", "electronegativity": 3.04, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "O": {"name": "Oxygen", "electronegativity": 3.44, "oxidation_numbers": [-2, -1, 0, 1, 2]}, "F": {"name": "Fluorine", "electronegativity": 3.98, "oxidation_numbers": [-1, 0]}, "Ne": {"name": "Neon", "electronegativity": null, "oxidation_numbers": [0]}, "Na": {"name": "Sodium", "electronegativity": 0.93, "oxidation_numbers": [0, 1]}, "Mg": {"name": "Magnesium", "electronegativity": 1.31, "oxidation_numbers": [0, 2]}, "Al": {"name": "Aluminium", "electronegativity": 1.61, "oxidation_numbers": [0, 1, 2, 3]}, "Si": {"name": "Silicon", "electronegativity": 1.9, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4]}, "P": {"name": "Phosphorus", "electronegativity": 2.19, "oxidation_numbers": [-3, -2, -1, 0, 1, 3, 4, 5]}, "S": {"name": "Sulfur", "electronegativity": 2.58, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Cl": {"name": "Chlorine", "electronegativity": 3.16, "oxidation_numbers": [-1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Ar": {"name": "Argon", "electronegativity": null, "oxidation_numbers": [0]}, "K": {"name": "Potassium", "electronegativity": 0.82, "oxidation_numbers": [0, 1]}, "Ca": {"name": "Calcium", "electronegativity": 1.0, "oxidation_numbers": [0, 2]}, "Sc": {"name": "Scandium", "electronegativity": 1.36, "oxidation_numbers": [0, 1, 2, 3]}, "Ti": {"name": "Titanium", "electronegativity": 1.54, "oxidation_numbers": [0, 1, 2, 3, 4]}, "V": {"name": "Vanadium", "electronegativity": 1.63, "oxidation_numbers": [0, 1, 2, 3, 4, 5]}, "Cr": {"name": "Chromium", "electronegativity": 1.66, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Mn": {"name": "Manganese", "electronegativity": 1.55, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Fe": {"name": "Iron", "electronegativity": 1.83, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Co": {"name": "Cobalt", "electronegativity": 1.88, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Ni": {"name": "Nickel", "electronegativity": 1.91, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4]}, "Cu": {"name": "Copper", "electronegativity": 1.9, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4]}, "Zn": {"name": "Zinc", "electronegativity": 1.65, "oxidation_numbers": [0, 1, 2]}, "Ga": {"name": "Gallium", "electronegativity": 1.81, "oxidation_numbers": [-5, -4, -3, -2, -1, 0, 1, 2, 3]}, "Ge": {"name": "Germanium", "electronegativity": 2.01, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4]}, "As": {"name": "Arsenic", "electronegativity": 2.18, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Se": {"name": "Selenium", "electronegativity": 2.55, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Br": {"name": "Bromine", "electronegativity": 2.96, "oxidation_numbers": [-1, 0, 1, 2, 3, 4, 5]}, "Kr": {"name": "Krypton", "electronegativity": null, "oxidation_numbers": [0, 1, 2]}, "Rb": {"name": "Rubidium", "electronegativity": 0.82, "oxidation_numbers": [0, 1]}, "Sr": {"name": "Strontium", "electronegativity": 0.95, "oxidation_numbers": [0, 2]}, "Y": {"name": "Yttrium", "electronegativity": 1.22, "oxidation_numbers": [0, 1, 2, 3]}, "Zr": {"name": "Zirconium", "electronegativity": 1.33, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Nb": {"name": "Niobium", "electronegativity": 1.6, "oxidation_numbers": [-1, 0, 1, 2, 3, 4, 5]}, "Mo": {"name": "Molybdenum", "electronegativity": 2.16, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Tc": {"name": "Technetium", "electronegativity": 1.9, "oxidation_numbers": [-3, -1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Ru": {"name": "Ruthenium", "electronegativity": 2.2, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]}, "Rh": {"name": "Rhodium", "electronegativity": 2.28, "oxidation_numbers": [-3, -1, 0, 1, 2, 3, 4, 5, 6]}, "Pd": {"name": "Palladium", "electronegativity": 2.2, "oxidation_numbers": [0, 1, 2, 3, 4, 5, 6]}, "Ag": {"name": "Silver", "electronegativity": 1.93, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4]}, "Cd": {"name": "Cadmium", "electronegativity": 1.69, "oxidation_numbers": [0, 1, 2]}, "In": {"name": "Indium", "electronegativity": 1.78, "oxidation_numbers": [-5, -2, -1, 0, 1, 2, 3]}, "Sn": {"name": "Tin", "electronegativity": 1.96, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4]}, "Sb": {"name": "Antimony", "electronegativity": 2.05, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Te": {"name": "Tellurium", "electronegativity": 2.1, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4, 5, 6]}, "I": {"name": "Iodine", "electronegativity": 2.66, "oxidation_numbers": [-1, 0, 1, 3, 5, 7]}, "Xe": {"name": "Xenon", "electronegativity": 2.6, "oxidation_numbers": [0, 1, 2, 4, 6, 8]}, "Cs": {"name": "Cesium", "electronegativity": 0.79, "oxidation_numbers": [0, 1]}, "Ba": {"name": "Barium", "electronegativity": 0.89, "oxidation_numbers": [0, 2]}, "La": {"name": "Lanthanum", "electronegativity": 1.1, "oxidation_numbers": [0, 1, 2, 3]}, "Ce": {"name": "Cerium", "electronegativity": 1.12, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Pr": {"name": "Praseodymium", "electronegativity": 1.13, "oxidation_numbers": [0, 1, 2, 3, 4, 5]}, "Nd": {"name": "Neodymium", "electronegativity": 1.14, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Pm": {"name": "Promethium", "electronegativity": 1.13, "oxidation_numbers": [0, 1, 2, 3]}, "Sm": {"name": "Samarium", "electronegativity": 1.17, "oxidation_numbers": [0, 1, 2, 3]}, "Eu": {"name": "Europium", "electronegativity": 1.0, "oxidation_numbers": [0, 1, 2, 3]}, "Gd": {"name": "Gadolinium", "electronegativity": 1.2, "oxidation_numbers": [0, 1, 2, 3]}, "Tb": {"name": "Terbium", "electronegativity": 1.1, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Dy": {"name": "Dysprosium", "electronegativity": 1.22, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Ho": {"name": "Holmium", "electronegativity": 1.23, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Er": {"name": "Erbium", "electronegativity": 1.24, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Tm": {"name": "Thulium", "electronegativity": 1.25, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Yb": {"name": "Ytterbium", "electronegativity": 1.1, "oxidation_numbers": [0, 1, 2, 3]}, "Lu": {"name": "Lutetium", "electronegativity": 1.27, "oxidation_numbers": [0, 1, 2, 3]}, "Hf": {"name": "Hafnium", "electronegativity": 1.3, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Ta": {"name": "Tantalum", "electronegativity": 1.5, "oxidation_numbers": [-3, 0, 1, 2, 3, 4, 5]}, "W": {"name": "Tungsten", "electronegativity": 2.36, "oxidation_numbers": [-4, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Re": {"name": "Rhenium", "electronegativity": 1.9, "oxidation_numbers": [-3, -1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Os": {"name": "Osmium", "electronegativity": 2.2, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]}, "Ir": {"name": "Iridium", "electronegativity": 2.2, "oxidation_numbers": [-3, -1, 0, 1, 2, 3, 4, 5, 6]}, "Pt": {"name": "Platinum", "electronegativity": 2.28, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Au": {"name": "Gold", "electronegativity": 2.54, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 5]}, "Hg": {"name": "Mercury", "electronegativity": 2.0, "oxidation_numbers": [-2, -1, 0, 1, 2, 4]}, "Tl": {"name": "Thallium", "electronegativity": 1.62, "oxidation_numbers": [-5, -2, -1, 0, 1, 2, 3]}, "Pb": {"name": "Lead", "electronegativity": 2.33, "oxidation_numbers": [-4, -3, -2, -1, 0, 1, 2, 3, 4]}, "Bi": {"name": "Bismuth", "electronegativity": 2.02, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Po": {"name": "Polonium", "electronegativity": 2.0, "oxidation_numbers": [-2, -1, 0, 1, 2, 3, 4, 5, 6]}, "At": {"name": "Astatine", "electronegativity": 2.2, "oxidation_numbers": [-1, 0, 1, 3, 5, 7]}, "Rn": {"name": "Radon", "electronegativity": null, "oxidation_numbers": [0, 2, 4, 6]}, "Fr": {"name": "Francium", "electronegativity": 0.7, "oxidation_numbers": [0, 1]}, "Ra": {"name": "Radium", "electronegativity": 0.9, "oxidation_numbers": [0, 2]}, "Ac": {"name": "Actinium", "electronegativity": 1.1, "oxidation_numbers": [0, 1, 2, 3]}, "Th": {"name": "Thorium", "electronegativity": 1.3, "oxidation_numbers": [0, 1, 2, 3, 4]}, "Pa": {"name": "Protactinium", "electronegativity": 1.5, "oxidation_numbers": [0, 1, 2, 3, 4, 5]}, "U": {"name": "Uranium", "electronegativity": 1.38, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Np": {"name": "Neptunium", "electronegativity": 1.36, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Pu": {"name": "Plutonium", "electronegativity": 1.28, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]}, "Am": {"name": "Americium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Cm": {"name": "Curium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]}, "Bk": {"name": "Berkelium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Cf": {"name": "Californium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4, 5]}, "Es": {"name": "Einsteinium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3, 4]}, "Fm": {"name": "Fermium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3]}, "Md": {"name": "Mendelevium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3]}, "No": {"name": "Nobelium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3]}, "Lr": {"name": "Lawrencium", "electronegativity": 1.3, "oxidation_numbers": [-3, -2, -1, 0, 1, 2, 3]}, "Rf": {"name": "Rutherfordium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4]}, "Db": {"name": "Dubnium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5]}, "Sg": {"name": "Seaborgium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6]}, "Bh": {"name": "Bohrium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Hs": {"name": "Hassium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7, 8]}, "Mt": {"name": "Meitnerium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Ds": {"name": "Darmstadtium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Rg": {"name": "Roentgenium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Cn": {"name": "Copernicium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Nh": {"name": "Nihonium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Fl": {"name": "Flerovium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Mc": {"name": "Moscovium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Lv": {"name": "Livermorium", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Ts": {"name": "Tennessine", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}, "Og": {"name": "Oganesson", "electronegativity": null, "oxidation_numbers": [0, 2, 3, 4, 5, 6, 7]}};

const POLYATOMIC_IONS = {
    "SO4": -2, "SO3": -2, "HSO4": -1, "HSO3": -1,
    "NO3": -1, "NO2": -1, "PO4": -3, "HPO4": -2, "H2PO4": -1,
    "CO3": -2, "HCO3": -1, "OH": -1, "ClO4": -1, "ClO3": -1,
    "ClO2": -1, "ClO": -1, "CN": -1, "SCN": -1, "MnO4": -1,
    "CrO4": -2, "Cr2O7": -2, "C2O4": -2, "CH3COO": -1, "C2H3O2": -1,
    "NH4": 1
};

// 2. Fraction Math Class
class Fraction {
    constructor(num, den = 1) {
        if (num instanceof Fraction) {
            this.n = num.n;
            this.d = num.d;
            return;
        }
        let n = parseInt(num);
        let d = parseInt(den);
        if (isNaN(n) || isNaN(d)) {
            this.n = 0;
            this.d = 1;
            return;
        }
        if (d === 0) throw new Error("Division by zero in Fraction");
        if (d < 0) {
            n = -n;
            d = -d;
        }
        let g = Math.abs(gcd(n, d));
        this.n = n / g;
        this.d = d / g;
    }
    
    add(other) {
        other = new Fraction(other);
        return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
    }
    sub(other) {
        other = new Fraction(other);
        return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
    }
    mul(other) {
        other = new Fraction(other);
        return new Fraction(this.n * other.n, this.d * other.d);
    }
    div(other) {
        other = new Fraction(other);
        return new Fraction(this.n * other.d, this.d * other.n);
    }
    neg() { return new Fraction(-this.n, this.d); }
    abs() { return new Fraction(Math.abs(this.n), this.d); }
    equals(other) {
        other = new Fraction(other);
        return this.n === other.n && this.d === other.d;
    }
    valueOf() { return this.n / this.d; }
    toString() {
        if (this.d === 1) return this.n.toString();
        return `${this.n}/${this.d}`;
    }
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

function findLcmOfList(numbers) {
    let currentLcm = 1;
    for (let num of numbers) {
        currentLcm = lcm(currentLcm, num);
    }
    return currentLcm;
}

// 3. Matrix RREF & Null Space Solver
function rref(matrix) {
    if (!matrix || matrix.length === 0) return [];
    let mat = matrix.map(row => row.map(val => new Fraction(val)));
    let rowCount = mat.length;
    let colCount = mat[0].length;
    
    let lead = 0;
    for (let r = 0; r < rowCount; r++) {
        if (lead >= colCount) return mat;
        let i = r;
        while (mat[i][lead].n === 0) {
            i++;
            if (i === rowCount) {
                i = r;
                lead++;
                if (lead === colCount) return mat;
            }
        }
        
        let temp = mat[i];
        mat[i] = mat[r];
        mat[r] = temp;
        
        let lv = mat[r][lead];
        mat[r] = mat[r].map(val => val.div(lv));
        
        for (let i = 0; i < rowCount; i++) {
            if (i !== r) {
                let lv2 = mat[i][lead];
                mat[i] = mat[i].map((val, idx) => val.sub(lv2.mul(mat[r][idx])));
            }
        }
        lead++;
    }
    return mat;
}

function findNullSpace(matrix) {
    if (!matrix || matrix.length === 0) return [];
    let R = matrix.length;
    let C = matrix[0].length;
    let rrefMat = rref(matrix);
    
    let pivotCols = {};
    let row = 0;
    for (let col = 0; col < C; col++) {
        if (row < R && rrefMat[row][col].n === 1 && rrefMat[row][col].d === 1) {
            let isPivot = true;
            for (let r = 0; r < R; r++) {
                if (r !== row && rrefMat[r][col].n !== 0) {
                    isPivot = false;
                    break;
                }
            }
            if (isPivot) {
                pivotCols[col] = row;
                row++;
            }
        }
    }
    
    let freeCols = [];
    for (let col = 0; col < C; col++) {
        if (pivotCols[col] === undefined) {
            freeCols.push(col);
        }
    }
    
    let basis = [];
    for (let fCol of freeCols) {
        let vec = Array(C).fill(0).map(() => new Fraction(0));
        vec[fCol] = new Fraction(1);
        for (let pCol in pivotCols) {
            let r = pivotCols[pCol];
            vec[pCol] = rrefMat[r][fCol].neg();
        }
        basis.push(vec);
    }
    return basis;
}

// 4. Chemistry Parsers
function parseFormula(formula) {
    let stack = [{}];
    let i = 0;
    let n = formula.length;
    
    while (i < n) {
        let c = formula[i];
        if (c === '(') {
            stack.push({});
            i++;
        } else if (c === ')') {
            i++;
            let multiplierStr = "";
            while (i < n && /\d/.test(formula[i])) {
                multiplierStr += formula[i];
                i++;
            }
            let multiplier = multiplierStr ? parseInt(multiplierStr) : 1;
            
            let popped = stack.pop();
            let top = stack[stack.length - 1];
            for (let element in popped) {
                top[element] = (top[element] || 0) + popped[element] * multiplier;
            }
        } else if (/[A-Z]/.test(c)) {
            let symbol = c;
            i++;
            while (i < n && /[a-z]/.test(formula[i])) {
                symbol += formula[i];
                i++;
            }
            
            if (!ELEMENTS[symbol]) {
                throw new Error(`Invalid chemical element: "${symbol}"`);
            }
            
            let countStr = "";
            while (i < n && /\d/.test(formula[i])) {
                countStr += formula[i];
                i++;
            }
            let count = countStr ? parseInt(countStr) : 1;
            
            let top = stack[stack.length - 1];
            top[symbol] = (top[symbol] || 0) + count;
        } else if (/\s/.test(c)) {
            i++;
        } else {
            throw new Error(`Invalid character in formula: "${c}"`);
        }
    }
    
    if (stack.length !== 1) {
        throw new Error("Unbalanced parentheses in formula");
    }
    return stack[0];
}

function parseChargeValue(chargeStr) {
    chargeStr = chargeStr.trim();
    if (!chargeStr) return 0;
    if (chargeStr === '+' || chargeStr === '1+') return 1;
    if (chargeStr === '-' || chargeStr === '1-') return -1;
    
    if (chargeStr.endsWith('+')) return parseInt(chargeStr.slice(0, -1));
    if (chargeStr.endsWith('-')) return -parseInt(chargeStr.slice(0, -1));
    if (chargeStr.startsWith('+')) return parseInt(chargeStr.slice(1));
    if (chargeStr.startsWith('-')) return -parseInt(chargeStr.slice(1));
    throw new Error(`Invalid charge representation: ${chargeStr}`);
}

function parseSpecies(speciesStr) {
    speciesStr = speciesStr.trim();
    if (!speciesStr) throw new Error("Empty species string");
    
    if (speciesStr === "e-" || speciesStr === "e" || speciesStr === "e^-") {
        return ["", -1];
    }
    
    // 1. Check caret or parentheses charge
    let caretMatch = speciesStr.match(/[\^\(]([0-9]*[+-]|[+-][0-9]*)[\)]?$/);
    if (caretMatch) {
        let chargeStr = caretMatch[1];
        let formula = speciesStr.slice(0, caretMatch.index).trim();
        let charge = parseChargeValue(chargeStr);
        return [formula, charge];
    }
    
    // 2. Trailing charge
    let trailMatch = speciesStr.match(/(\d*)([+-]+)$/);
    if (trailMatch) {
        let numStr = trailMatch[1];
        let signStr = trailMatch[2];
        let formula = speciesStr.slice(0, trailMatch.index).trim();
        
        if (numStr) {
            // If the matched digit sequence has length > 1 (e.g. "42" in C2O42-),
            // the last digit is the charge magnitude, and the prefix digits belong to the formula.
            if (numStr.length > 1) {
                let formulaDigit = numStr.slice(0, -1);
                let chargeDigit = numStr.slice(-1);
                formula = formula + formulaDigit;
                let charge = parseInt(chargeDigit) * (signStr[0] === '+' ? 1 : -1);
                return [formula, charge];
            }
            
            // Otherwise (single digit):
            let chargeIsDigit = true;
            if (signStr[0] === '-') {
                if (formula && /\d/.test(formula[formula.length - 1])) {
                    chargeIsDigit = true;
                } else {
                    let uppercaseCount = (formula.match(/[A-Z]/g) || []).length;
                    if (uppercaseCount > 1) {
                        chargeIsDigit = false;
                    } else {
                        if (["I", "Br", "Cl", "O"].includes(formula) && numStr === "3") {
                            chargeIsDigit = false;
                        }
                    }
                }
            }
            
            let charge;
            if (chargeIsDigit) {
                charge = parseInt(numStr) * (signStr[0] === '+' ? 1 : -1);
            } else {
                formula = formula + numStr;
                charge = signStr.length * (signStr[0] === '+' ? 1 : -1);
            }
            return [formula, charge];
        } else {
            let charge = signStr.length * (signStr[0] === '+' ? 1 : -1);
            return [formula, charge];
        }
    }
    
    return [speciesStr, 0];
}

function parseEquation(equationStr) {
    let delimiters = ["-->", "->", "⇌", "=>", "="];
    let reactantsPart = null;
    let productsPart = null;
    
    for (let delim of delimiters) {
        if (equationStr.includes(delim)) {
            let parts = equationStr.split(delim);
            reactantsPart = parts[0];
            productsPart = parts[1];
            break;
        }
    }
    
    if (reactantsPart === null || productsPart === null) {
        throw new Error("Could not find reaction arrow (e.g. '->' or '=') in the equation.");
    }
    
    function parseSide(sideStr) {
        let speciesList = [];
        let terms = sideStr.split(/\s+\+\s+/);
        for (let term of terms) {
            term = term.trim();
            if (!term) continue;
            let match = term.match(/^(\d+)\s*(.*)$/);
            let coef = 1;
            let spec = term;
            if (match) {
                coef = parseInt(match[1]);
                spec = match[2].trim();
            }
            speciesList.push([coef, spec]);
        }
        return speciesList;
    }
    
    return [parseSide(reactantsPart), parseSide(productsPart)];
}

// 5. Oxidation State Rules
function splitNeutralCompound(formula) {
    let match = formula.match(/\(([^)]+)\)(\d*)/);
    if (match) {
        let anionFormula = match[1];
        let z = match[2] ? parseInt(match[2]) : 1;
        if (POLYATOMIC_IONS[anionFormula] !== undefined) {
            let anionCharge = POLYATOMIC_IONS[anionFormula];
            let cationPart = formula.slice(0, match.index).trim();
            let cationCounts = parseFormula(cationPart);
            let cationKeys = Object.keys(cationCounts);
            if (cationKeys.length === 1) {
                let cationElement = cationKeys[0];
                let x = cationCounts[cationElement];
                let cationCharge = -anionCharge * z / x;
                return [[cationElement, cationCharge], [anionFormula, anionCharge]];
            }
        }
    }
    
    if (formula.startsWith("NH4") && formula !== "NH4") {
        let anionPart = formula.slice(3);
        return [["NH4", 1], [anionPart, -1]];
    }
    
    let sortedAnions = Object.keys(POLYATOMIC_IONS).filter(k => POLYATOMIC_IONS[k] < 0).sort((a, b) => b.length - a.length);
    for (let anion of sortedAnions) {
        if (formula.endsWith(anion)) {
            let cationPart = formula.slice(0, -anion.length).trim();
            if (cationPart) {
                let cationCounts = parseFormula(cationPart);
                let cationKeys = Object.keys(cationCounts);
                if (cationKeys.length === 1) {
                    let cationElement = cationKeys[0];
                    let x = cationCounts[cationElement];
                    let anionCharge = POLYATOMIC_IONS[anion];
                    let cationCharge = -anionCharge / x;
                    return [[cationElement, cationCharge], [anion, anionCharge]];
                }
            }
        }
    }
    return null;
}

function assignOxidationStates(formula, charge) {
    let counts = parseFormula(formula);
    let keys = Object.keys(counts);
    
    if (keys.length === 1) {
        let el = keys[0];
        let cnt = counts[el];
        return { [el]: charge / cnt };
    }
    
    if (charge === 0) {
        let splitParts = splitNeutralCompound(formula);
        if (splitParts) {
            let oxStates = {};
            for (let [partFormula, partCharge] of splitParts) {
                let partOx = assignOxidationStates(partFormula, partCharge);
                Object.assign(oxStates, partOx);
            }
            return oxStates;
        }
    }
    
    let assigned = {};
    let alkaliMetals = new Set(["Li", "Na", "K", "Rb", "Cs", "Fr"]);
    let alkalineEarthMetals = new Set(["Be", "Mg", "Ca", "Sr", "Ba", "Ra"]);
    
    for (let el of keys) {
        if (alkaliMetals.has(el)) assigned[el] = 1;
        if (alkalineEarthMetals.has(el)) assigned[el] = 2;
    }
    
    if (counts["F"]) assigned["F"] = -1;
    
    if (counts["H"]) {
        let otherElements = keys.filter(el => el !== "H");
        let isMetalHydride = true;
        for (let el of otherElements) {
            if (ELEMENTS[el] && ELEMENTS[el].electronegativity !== null && ELEMENTS[el].electronegativity >= 1.8) {
                isMetalHydride = false;
                break;
            }
        }
        assigned["H"] = (isMetalHydride && otherElements.length > 0) ? -1 : 1;
    }
    
    if (counts["O"] && assigned["O"] === undefined) {
        let isPeroxide = false;
        let isSuperoxide = false;
        let otherElements = keys.filter(el => el !== "O");
        
        if (otherElements.length === 1) {
            let otherEl = otherElements[0];
            let otherCnt = counts[otherEl];
            let oCnt = counts["O"];
            if (alkaliMetals.has(otherEl) && otherCnt === 2 && oCnt === 2) isPeroxide = true;
            else if (otherEl === "H" && otherCnt === 2 && oCnt === 2) isPeroxide = true;
            else if (alkalineEarthMetals.has(otherEl) && otherCnt === 1 && oCnt === 2) isPeroxide = true;
            else if (alkaliMetals.has(otherEl) && otherCnt === 1 && oCnt === 2) isSuperoxide = true;
        }
        
        if (isPeroxide) assigned["O"] = -1;
        else if (isSuperoxide) assigned["O"] = -0.5;
        else assigned["O"] = -2;
    }
    
    let unassigned = keys.filter(el => assigned[el] === undefined);
    if (unassigned.length === 1) {
        let el = unassigned[0];
        let cnt = counts[el];
        let assignedSum = 0;
        for (let x in assigned) assignedSum += assigned[x] * counts[x];
        assigned[el] = (charge - assignedSum) / cnt;
        return assigned;
    }
    
    let preferredNegative = {
        "F": -1, "O": -2, "Cl": -1, "Br": -1, "I": -1,
        "S": -2, "Se": -2, "Te": -2, "N": -3, "P": -3, "As": -3
    };
    
    let remainingElements = unassigned.sort((a, b) => {
        let enA = ELEMENTS[a] ? ELEMENTS[a].electronegativity || 0 : 0;
        let enB = ELEMENTS[b] ? ELEMENTS[b].electronegativity || 0 : 0;
        return enB - enA;
    });
    
    for (let idx = 0; idx < remainingElements.length; idx++) {
        let el = remainingElements[idx];
        if (idx === remainingElements.length - 1) {
            let cnt = counts[el];
            let assignedSum = 0;
            for (let x in assigned) assignedSum += assigned[x] * counts[x];
            assigned[el] = (charge - assignedSum) / cnt;
        } else {
            if (preferredNegative[el] !== undefined) {
                assigned[el] = preferredNegative[el];
            } else {
                let oxNums = ELEMENTS[el] ? ELEMENTS[el].oxidation_numbers || [] : [];
                let negOx = oxNums.filter(x => x < 0);
                assigned[el] = negOx.length > 0 ? negOx[0] : 0;
            }
        }
    }
    
    return assigned;
}

function simplifyCoefficients(coeffs) {
    if (coeffs.length === 0) return coeffs;
    let g = Math.abs(coeffs[0]);
    for (let c of coeffs) {
        g = gcd(g, Math.abs(c));
    }
    if (g > 1) {
        return coeffs.map(c => c / g);
    }
    return coeffs;
}

// 6. Reaction Balancer Class
class Reaction {
    constructor(equationStr, medium = null) {
        this.rawEquation = equationStr;
        this.medium = medium;
        
        let [reactants, products] = parseEquation(equationStr);
        this.origReactants = reactants.map(item => item[1]);
        this.origProducts = products.map(item => item[1]);
        this.isBalanced = false;
        this.balancedReactants = [];
        this.balancedProducts = [];
    }
    
    balanceWithMedium(medium) {
        let rInfo = this.origReactants.map(spec => {
            let [f, ch] = parseSpecies(spec);
            return [f, ch, parseFormula(f)];
        });
        let pInfo = this.origProducts.map(spec => {
            let [f, ch] = parseSpecies(spec);
            return [f, ch, parseFormula(f)];
        });
        
        let extraInfo = [];
        if (medium === "acidic") {
            extraInfo.push(["H", 1, {"H": 1}]);
            extraInfo.push(["H2O", 0, {"H": 2, "O": 1}]);
        } else if (medium === "basic") {
            extraInfo.push(["OH", -1, {"O": 1, "H": 1}]);
            extraInfo.push(["H2O", 0, {"H": 2, "O": 1}]);
        }
        
        let a = rInfo.length;
        let b = pInfo.length;
        let e = extraInfo.length;
        
        let elements = new Set();
        for (let [, , counts] of [...rInfo, ...pInfo, ...extraInfo]) {
            for (let el in counts) elements.add(el);
        }
        elements = Array.from(elements).sort();
        
        // Match non-H/O elements
        let origRElements = new Set();
        for (let [, , counts] of rInfo) {
            for (let el in counts) origRElements.add(el);
        }
        let origPElements = new Set();
        for (let [, , counts] of pInfo) {
            for (let el in counts) origPElements.add(el);
        }
        
        let nonHoR = Array.from(origRElements).filter(el => el !== "H" && el !== "O").sort();
        let nonHoP = Array.from(origPElements).filter(el => el !== "H" && el !== "O").sort();
        
        if (JSON.stringify(nonHoR) !== JSON.stringify(nonHoP)) {
            return null;
        }
        
        let numRows = elements.length + 1;
        let numCols = a + b + e;
        let matrix = Array(numRows).fill(0).map(() => Array(numCols).fill(0));
        
        for (let r = 0; r < elements.length; r++) {
            let el = elements[r];
            for (let i = 0; i < a; i++) matrix[r][i] = rInfo[i][2][el] || 0;
            for (let j = 0; j < b; j++) matrix[r][a + j] = -(pInfo[j][2][el] || 0);
            for (let k = 0; k < e; k++) matrix[r][a + b + k] = extraInfo[k][2][el] || 0;
        }
        
        let rCharge = elements.length;
        for (let i = 0; i < a; i++) matrix[rCharge][i] = rInfo[i][1];
        for (let j = 0; j < b; j++) matrix[rCharge][a + j] = -pInfo[j][1];
        for (let k = 0; k < e; k++) matrix[rCharge][a + b + k] = extraInfo[k][1];
        
        let basis = findNullSpace(matrix);
        if (basis.length === 0) return null;
        
        let d = basis.length;
        let bestSolution = null;
        let minCoefSum = Infinity;
        
        let combos = [];
        if (d === 1) {
            combos = [[1], [-1]];
        } else {
            // Simple grid search for combinations
            function generateCombos(depth, current) {
                if (depth === d) {
                    if (!current.every(x => x === 0)) combos.push(current);
                    return;
                }
                for (let w = -10; w <= 10; w++) {
                    generateCombos(depth + 1, [...current, w]);
                }
            }
            generateCombos(0, []);
        }
        
        for (let combo of combos) {
            let vec = Array(numCols).fill(0).map(() => new Fraction(0));
            for (let j = 0; j < d; j++) {
                let weight = combo[j];
                if (weight !== 0) {
                    for (let idx = 0; idx < numCols; idx++) {
                        vec[idx] = vec[idx].add(basis[j][idx].mul(weight));
                    }
                }
            }
            
            let allPositive = vec.slice(0, a + b).every(val => val.valueOf() > 0);
            let allNegative = vec.slice(0, a + b).every(val => val.valueOf() < 0);
            
            let sign = 0;
            if (allPositive) sign = 1;
            else if (allNegative) sign = -1;
            else continue;
            
            let v = vec.map(val => val.mul(sign));
            let denoms = v.map(val => val.d);
            let lcmVal = findLcmOfList(denoms);
            let integerV = v.map(val => Math.round(val.valueOf() * lcmVal));
            
            if (integerV.slice(0, a + b).some(coef => coef <= 0)) continue;
            
            let coefSum = integerV.reduce((sum, val) => sum + Math.abs(val), 0);
            if (coefSum < minCoefSum) {
                minCoefSum = coefSum;
                bestSolution = integerV;
            }
        }
        
        if (!bestSolution) return null;
        
        bestSolution = simplifyCoefficients(bestSolution);
        
        let reactantsRes = [];
        for (let i = 0; i < a; i++) {
            reactantsRes.push([bestSolution[i], this.origReactants[i]]);
        }
        let productsRes = [];
        for (let j = 0; j < b; j++) {
            productsRes.push([bestSolution[a + j], this.origProducts[j]]);
        }
        
        if (medium === "acidic") {
            let hCoef = bestSolution[a + b];
            if (hCoef > 0) reactantsRes.push([hCoef, "H+"]);
            else if (hCoef < 0) productsRes.push([-hCoef, "H+"]);
            
            let wCoef = bestSolution[a + b + 1];
            if (wCoef > 0) reactantsRes.push([wCoef, "H2O"]);
            else if (wCoef < 0) productsRes.push([-wCoef, "H2O"]);
        } else if (medium === "basic") {
            let ohCoef = bestSolution[a + b];
            if (ohCoef > 0) reactantsRes.push([ohCoef, "OH-"]);
            else if (ohCoef < 0) productsRes.push([-ohCoef, "OH-"]);
            
            let wCoef = bestSolution[a + b + 1];
            if (wCoef > 0) reactantsRes.push([wCoef, "H2O"]);
            else if (wCoef < 0) productsRes.push([-wCoef, "H2O"]);
        }
        
        function mergeDuplicates(list) {
            let merged = {};
            for (let [coef, spec] of list) {
                merged[spec] = (merged[spec] || 0) + coef;
            }
            return Object.keys(merged).map(spec => [merged[spec], spec]).filter(item => item[0] > 0);
        }
        
        return [mergeDuplicates(reactantsRes), mergeDuplicates(productsRes)];
    }
    
    balance() {
        if (this.medium !== "auto" && this.medium !== null) {
            let res = this.balanceWithMedium(this.medium);
            if (res) {
                this.balancedReactants = res[0];
                this.balancedProducts = res[1];
                this.isBalanced = true;
            } else {
                throw new Error(`Could not balance reaction in ${this.medium} medium.`);
            }
        } else {
            for (let med of ["neutral", "acidic", "basic"]) {
                let res = this.balanceWithMedium(med);
                if (res) {
                    this.balancedReactants = res[0];
                    this.balancedProducts = res[1];
                    this.medium = med;
                    this.isBalanced = true;
                    break;
                }
            }
            if (!this.isBalanced) {
                throw new Error("Could not balance reaction in any medium.");
            }
        }
        return this.getBalancedEquationStr();
    }
    
    getBalancedEquationStr() {
        if (!this.isBalanced) return "Reaction not balanced.";
        let formatSide = list => list.map(([coef, spec]) => `${coef > 1 ? coef + " " : ""}${spec}`).join(" + ");
        let arrow = this.rawEquation.includes("⇌") ? " ⇌ " : (this.rawEquation.includes("=>") ? " => " : " -> ");
        return formatSide(this.balancedReactants) + arrow + formatSide(this.balancedProducts);
    }
    
    balanceHalfReaction(activeElementsList, isReduction) {
        if (!activeElementsList || activeElementsList.length === 0) return "";
        
        let reactantSpecs = new Set();
        let productSpecs = new Set();
        for (let item of activeElementsList) {
            reactantSpecs.add(item.from_species);
            productSpecs.add(item.to_species);
        }
        
        let reactants = [];
        for (let [coef, spec] of this.balancedReactants) {
            if (reactantSpecs.has(spec)) {
                reactants.push([coef, spec]);
            }
        }
        
        let products = [];
        for (let [coef, spec] of this.balancedProducts) {
            if (productSpecs.has(spec)) {
                products.push([coef, spec]);
            }
        }
        
        if (reactants.length === 0 || products.length === 0) return "";
        
        // 1. Balance active elements (non-H/O)
        reactants = reactants.map(([coef, spec]) => [coef, spec]);
        products = products.map(([coef, spec]) => [coef, spec]);
        
        let activeElements = new Set();
        for (let [, spec] of [...reactants, ...products]) {
            let [formula, ] = parseSpecies(spec);
            let counts = parseFormula(formula);
            for (let el in counts) {
                if (el !== "H" && el !== "O") activeElements.add(el);
            }
        }
        
        for (let el of activeElements) {
            let leftCount = 0;
            for (let [coef, spec] of reactants) {
                let [formula, ] = parseSpecies(spec);
                let counts = parseFormula(formula);
                if (counts[el]) leftCount += counts[el] * coef;
            }
            let rightCount = 0;
            for (let [coef, spec] of products) {
                let [formula, ] = parseSpecies(spec);
                let counts = parseFormula(formula);
                if (counts[el]) rightCount += counts[el] * coef;
            }
            
            if (leftCount !== rightCount && leftCount > 0 && rightCount > 0) {
                let g = gcd(leftCount, rightCount);
                let leftScale = rightCount / g;
                let rightScale = leftCount / g;
                
                for (let item of reactants) {
                    let [formula, ] = parseSpecies(item[1]);
                    let counts = parseFormula(formula);
                    if (counts[el]) item[0] *= leftScale;
                }
                for (let item of products) {
                    let [formula, ] = parseSpecies(item[1]);
                    let counts = parseFormula(formula);
                    if (counts[el]) item[0] *= rightScale;
                }
            }
        }
        
        // 2. Balance O atoms using H2O
        let countAtoms = list => {
            let total = { H: 0, O: 0 };
            for (let [coef, spec] of list) {
                let [formula, ] = parseSpecies(spec);
                let counts = parseFormula(formula);
                for (let el in counts) {
                    if (el === "H" || el === "O") {
                        total[el] = (total[el] || 0) + counts[el] * coef;
                    }
                }
            }
            return total;
        };
        
        let rCounts = countAtoms(reactants);
        let pCounts = countAtoms(products);
        let oDiff = rCounts.O - pCounts.O;
        if (oDiff > 0) {
            products.push([oDiff, "H2O"]);
        } else if (oDiff < 0) {
            reactants.push([-oDiff, "H2O"]);
        }
        
        // 3. Balance H atoms using H+ / OH-
        rCounts = countAtoms(reactants);
        pCounts = countAtoms(products);
        let hDiff = rCounts.H - pCounts.H;
        
        if (this.medium === "basic") {
            if (hDiff > 0) {
                products.push([hDiff, "H2O"]);
                reactants.push([hDiff, "OH-"]);
            } else if (hDiff < 0) {
                reactants.push([-hDiff, "H2O"]);
                products.push([-hDiff, "OH-"]);
            }
        } else {
            if (hDiff > 0) {
                products.push([hDiff, "H+"]);
            } else if (hDiff < 0) {
                reactants.push([-hDiff, "H+"]);
            }
        }
        
        // Merge duplicates
        let mergeDuplicates = list => {
            let merged = {};
            for (let [coef, spec] of list) {
                let norm = spec.trim();
                merged[norm] = (merged[norm] || 0) + coef;
            }
            return Object.keys(merged).map(spec => [merged[spec], spec]).filter(item => item[0] > 0);
        };
        
        reactants = mergeDuplicates(reactants);
        products = mergeDuplicates(products);
        
        // Simplify H2O
        let rH2O = reactants.find(item => item[1] === "H2O");
        let pH2O = products.find(item => item[1] === "H2O");
        if (rH2O && pH2O) {
            let minH2O = Math.min(rH2O[0], pH2O[0]);
            rH2O[0] -= minH2O;
            pH2O[0] -= minH2O;
            reactants = reactants.filter(item => item[0] > 0);
            products = products.filter(item => item[0] > 0);
        }
        
        // 4. Balance charge using e-
        let rCharge = 0;
        for (let [coef, spec] of reactants) {
            let [, charge] = parseSpecies(spec);
            rCharge += charge * coef;
        }
        let pCharge = 0;
        for (let [coef, spec] of products) {
            let [, charge] = parseSpecies(spec);
            pCharge += charge * coef;
        }
        
        let chargeDiff = rCharge - pCharge;
        if (chargeDiff > 0) {
            reactants.push([chargeDiff, "e-"]);
        } else if (chargeDiff < 0) {
            products.push([-chargeDiff, "e-"]);
        }
        
        reactants = mergeDuplicates(reactants);
        products = mergeDuplicates(products);
        
        // 5. Simplify by dividing by GCD
        let finalGcd = 0;
        for (let [coef, ] of [...reactants, ...products]) {
            finalGcd = gcd(finalGcd, coef);
        }
        if (finalGcd > 1) {
            reactants = reactants.map(([coef, spec]) => [coef / finalGcd, spec]);
            products = products.map(([coef, spec]) => [coef / finalGcd, spec]);
        }
        
        let formatSide = list => list.map(([coef, spec]) => `${coef > 1 ? coef + " " : ""}${spec}`).join(" + ");
        let arrow = this.rawEquation.includes("⇌") ? " ⇌ " : (this.rawEquation.includes("=>") ? " => " : " -> ");
        return formatSide(reactants) + arrow + formatSide(products);
    }
    
    analyze() {
        if (!this.isBalanced) this.balance();
        
        let reactantsOx = {};
        for (let [, spec] of this.balancedReactants) {
            let [f, ch] = parseSpecies(spec);
            reactantsOx[spec] = assignOxidationStates(f, ch);
        }
        let productsOx = {};
        for (let [, spec] of this.balancedProducts) {
            let [f, ch] = parseSpecies(spec);
            productsOx[spec] = assignOxidationStates(f, ch);
        }
        
        let elReactants = {};
        for (let spec in reactantsOx) {
            for (let el in reactantsOx[spec]) {
                if (!elReactants[el]) elReactants[el] = {};
                elReactants[el][spec] = reactantsOx[spec][el];
            }
        }
        let elProducts = {};
        for (let spec in productsOx) {
            for (let el in productsOx[spec]) {
                if (!elProducts[el]) elProducts[el] = {};
                elProducts[el][spec] = productsOx[spec][el];
            }
        }
        
        let oxidizedElements = [];
        let reducedElements = [];
        
        for (let el in elReactants) {
            if (elProducts[el]) {
                for (let rSpec in elReactants[el]) {
                    for (let pSpec in elProducts[el]) {
                        let rOx = elReactants[el][rSpec];
                        let pOx = elProducts[el][pSpec];
                        if (rOx !== pOx) {
                            let change = {
                                element: el,
                                from_species: rSpec,
                                from_ox: rOx,
                                to_species: pSpec,
                                to_ox: pOx
                            };
                            if (pOx > rOx) {
                                if (!oxidizedElements.some(x => x.element === el && x.from_species === rSpec && x.to_species === pSpec)) {
                                    oxidizedElements.push(change);
                                }
                            } else {
                                if (!reducedElements.some(x => x.element === el && x.from_species === rSpec && x.to_species === pSpec)) {
                                    reducedElements.push(change);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        let oxidizingAgents = new Set();
        let reducingAgents = new Set();
        
        for (let item of reducedElements) oxidizingAgents.add(item.from_species);
        for (let item of oxidizedElements) reducingAgents.add(item.from_species);
        
        let cleanAgents = set => {
            let arr = Array.from(set).filter(x => !["H+", "OH-", "H2O"].includes(x));
            return arr.length > 0 ? arr : Array.from(set);
        };
        
        let oxidationHalfReaction = this.balanceHalfReaction(oxidizedElements, false);
        let reductionHalfReaction = this.balanceHalfReaction(reducedElements, true);
        
        return {
            balancedEquation: this.getBalancedEquationStr(),
            medium: this.medium,
            reactantOxidationStates: reactantsOx,
            productOxidationStates: productsOx,
            oxidizedElements: oxidizedElements,
            reducedElements: reducedElements,
            oxidizingAgents: cleanAgents(oxidizingAgents),
            reducingAgents: cleanAgents(reducingAgents),
            oxidationHalfReaction: oxidationHalfReaction,
            reductionHalfReaction: reductionHalfReaction
        };
    }
}

// 7. HTML Renderer Helpers
function formatChemicalFormulaHTML(speciesStr) {
    // Splits the species into formula and charge
    try {
        if (speciesStr === "e-" || speciesStr === "e" || speciesStr === "e^-") {
            return "e<sup>-</sup>";
        }
        let [formula, charge] = parseSpecies(speciesStr);
        
        // Format formula subscripts
        // Matches digits and wraps in <sub>, excluding ones in parentheses multipliers (handled simply by wrapping any digits in sub)
        let formattedFormula = formula.replace(/(\d+)/g, "<sub>$1</sub>");
        
        // Format charge superscript
        let formattedCharge = "";
        if (charge !== 0) {
            let sign = charge > 0 ? "+" : "-";
            let mag = Math.abs(charge);
            let magStr = mag === 1 ? "" : mag.toString();
            formattedCharge = `<sup>${magStr}${sign}</sup>`;
        }
        
        return `${formattedFormula}${formattedCharge}`;
    } catch (e) {
        return speciesStr; // fallback
    }
}

function formatEquationHTML(eqStr) {
    let delimiters = ["-->", "->", "⇌", "=>", "="];
    let arrowHTML = " → ";
    let rawArrow = " -> ";
    
    for (let delim of delimiters) {
        if (eqStr.includes(delim)) {
            rawArrow = delim;
            if (delim === "⇌") arrowHTML = " ⇌ ";
            else if (delim === "=>") arrowHTML = " ⇒ ";
            else if (delim === "=") arrowHTML = " = ";
            break;
        }
    }
    
    let parts = eqStr.split(rawArrow);
    if (parts.length !== 2) return eqStr;
    
    let formatSide = sideStr => {
        return sideStr.split(/\s+\+\s+/).map(term => {
            term = term.trim();
            let match = term.match(/^(\d+)\s*(.*)$/);
            if (match) {
                return `<span class="coef">${match[1]}</span> ${formatChemicalFormulaHTML(match[2])}`;
            }
            return formatChemicalFormulaHTML(term);
        }).join(" + ");
    };
    
    return `${formatSide(parts[0])}${arrowHTML}${formatSide(parts[1])}`;
}

function formatSign(val) {
    if (val > 0) return `+${val}`;
    return val.toString();
}

// 8. UI Binding & Event Listeners
function init() {
    const form = document.getElementById("solver-form");
    const input = document.getElementById("equation-input");
    const clearBtn = document.getElementById("clear-btn");
    const submitBtn = document.getElementById("submit-btn");
    
    const errorBanner = document.getElementById("error-banner");
    const errorMessage = document.getElementById("error-message");
    
    const resultsContainer = document.getElementById("results-container");
    const balancedOutput = document.getElementById("balanced-output");
    const mediumBadge = document.getElementById("medium-badge");
    
    const oxidationDetails = document.getElementById("oxidation-details");
    const reductionDetails = document.getElementById("reduction-details");
    const reducingAgentBadge = document.getElementById("reducing-agent-badge");
    const oxidizingAgentBadge = document.getElementById("oxidizing-agent-badge");
    
    const statesTableBody = document.getElementById("states-table-body");
    
    // Clear Input
    clearBtn.addEventListener("click", () => {
        input.value = "";
        input.focus();
        clearBtn.style.display = "none";
    });
    
    input.addEventListener("input", () => {
        clearBtn.style.display = input.value ? "block" : "none";
    });
    
    const runSolver = () => {
        let equationText = input.value.trim();
        if (!equationText) return;
        
        // Hide previous errors & results
        errorBanner.classList.add("hidden");
        resultsContainer.classList.add("hidden");
        
        // Get selected medium
        let selectedMedium = document.querySelector('input[name="medium"]:checked').value;
        
        try {
            let rxn = new Reaction(equationText, selectedMedium);
            let analysis = rxn.analyze();
            
            // Populate Balanced Equation
            balancedOutput.innerHTML = formatEquationHTML(analysis.balancedEquation);
            mediumBadge.textContent = `${analysis.medium.toUpperCase()} MEDIUM`;
            
            // Populate Redox Details
            // Oxidation
            if (analysis.oxidizedElements.length > 0) {
                oxidationDetails.innerHTML = analysis.oxidizedElements.map(item => {
                    return `<div class="detail-item">
                        Element <span class="highlight">${item.element}</span> in ${formatChemicalFormulaHTML(item.from_species)} 
                        is oxidized from <span class="ox-num">${formatSign(item.from_ox)}</span> to 
                        <span class="ox-num">${formatSign(item.to_ox)}</span> in ${formatChemicalFormulaHTML(item.to_species)}.
                    </div>`;
                }).join("");
            } else {
                oxidationDetails.innerHTML = `<div class="detail-item muted">No oxidation changes detected.</div>`;
            }
            
            const oxHalfWrapper = document.getElementById("oxidation-half-wrapper");
            if (analysis.oxidationHalfReaction) {
                document.getElementById("oxidation-half-reaction").innerHTML = formatEquationHTML(analysis.oxidationHalfReaction);
                oxHalfWrapper.classList.remove("hidden");
            } else {
                oxHalfWrapper.classList.add("hidden");
            }
            
            // Reduction
            if (analysis.reducedElements.length > 0) {
                reductionDetails.innerHTML = analysis.reducedElements.map(item => {
                    return `<div class="detail-item">
                        Element <span class="highlight">${item.element}</span> in ${formatChemicalFormulaHTML(item.from_species)} 
                        is reduced from <span class="ox-num">${formatSign(item.from_ox)}</span> to 
                        <span class="ox-num">${formatSign(item.to_ox)}</span> in ${formatChemicalFormulaHTML(item.to_species)}.
                    </div>`;
                }).join("");
            } else {
                reductionDetails.innerHTML = `<div class="detail-item muted">No reduction changes detected.</div>`;
            }
            
            const redHalfWrapper = document.getElementById("reduction-half-wrapper");
            if (analysis.reductionHalfReaction) {
                document.getElementById("reduction-half-reaction").innerHTML = formatEquationHTML(analysis.reductionHalfReaction);
                redHalfWrapper.classList.remove("hidden");
            } else {
                redHalfWrapper.classList.add("hidden");
            }
            
            // Populate Agents
            reducingAgentBadge.innerHTML = analysis.reducingAgents.map(a => formatChemicalFormulaHTML(a)).join(", ") || "None";
            oxidizingAgentBadge.innerHTML = analysis.oxidizingAgents.map(a => formatChemicalFormulaHTML(a)).join(", ") || "None";
            
            // Populate Oxidation States Table
            let tableHTML = "";
            let allSpecies = {
                ...analysis.reactantOxidationStates,
                ...analysis.productOxidationStates
            };
            
            for (let spec in allSpecies) {
                let states = allSpecies[spec];
                let statesStr = Object.keys(states).map(el => {
                    return `<span class="state-chip">${el}: <span class="ox-num">${formatSign(states[el])}</span></span>`;
                }).join(" ");
                
                tableHTML += `<tr>
                    <td class="formula-cell">${formatChemicalFormulaHTML(spec)}</td>
                    <td>${statesStr}</td>
                </tr>`;
            }
            statesTableBody.innerHTML = tableHTML;
            
            // Show results container with a smooth fade-in
            resultsContainer.classList.remove("hidden");
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (err) {
            errorMessage.textContent = err.message;
            errorBanner.classList.remove("hidden");
        }
    };

    // Presets Click
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let eq = btn.getAttribute("data-eq");
            let med = btn.getAttribute("data-med");
            
            input.value = eq;
            clearBtn.style.display = "block";
            
            // Set medium radio button
            document.getElementById(`med-${med}`).checked = true;
            
            // Run solver directly
            runSolver();
        });
    });
    
    // Form Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        runSolver();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
