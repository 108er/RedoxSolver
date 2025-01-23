import csv

class Element:
    def __init__(self, name, symbol, electronegativity, oxidation_numbers):
        self.name = name
        self.symbol = symbol
        self.electronegativity = float(electronegativity) if electronegativity else None
        self.oxidation_numbers = [int(ox) for ox in oxidation_numbers.split(",")] if oxidation_numbers else []
    
    def __repr__(self):
        return f"Element(name={self.name}, symbol={self.symbol}, electronegativity={self.electronegativity}, oxidation_numbers={self.oxidation_numbers})"

def load_elements_from_csv(file_path):
    elements = []
    with open(file_path, "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            element = Element(
                name=row["Element"],
                symbol=row["Symbol"],
                electronegativity=row["Electronegativity"],
                oxidation_numbers=row["OxidationNumbers"]
            )
            elements.append(element)
    return elements

elements = load_elements_from_csv("data.csv")
for element in elements:
    print(element)