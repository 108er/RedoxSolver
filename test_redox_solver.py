import unittest
from utils import parse_formula, parse_species, parse_equation
from reaction import assign_oxidation_states, Reaction
from redox_solver import RedoxSolver

class TestChemicalParsers(unittest.TestCase):
    def test_parse_formula_simple(self):
        self.assertEqual(parse_formula("H2O"), {"H": 2, "O": 1})
        self.assertEqual(parse_formula("CO2"), {"C": 1, "O": 2})
        self.assertEqual(parse_formula("NaCl"), {"Na": 1, "Cl": 1})
        
    def test_parse_formula_nested(self):
        self.assertEqual(parse_formula("Fe2(SO4)3"), {"Fe": 2, "S": 3, "O": 12})
        self.assertEqual(parse_formula("Ca(OH)2"), {"Ca": 1, "O": 2, "H": 2})
        self.assertEqual(parse_formula("(NH4)2SO4"), {"N": 2, "H": 8, "S": 1, "O": 4})
        
    def test_parse_formula_invalid(self):
        with self.assertRaises(ValueError):
            parse_formula("Mno4")  # Mno is not a valid element (Mn is, o is lowercase and invalid)
        with self.assertRaises(ValueError):
            parse_formula("Fe(SO4")  # Unbalanced parenthesis
            
    def test_parse_species(self):
        self.assertEqual(parse_species("MnO4-"), ("MnO4", -1))
        self.assertEqual(parse_species("Fe2+"), ("Fe", 2))
        self.assertEqual(parse_species("Fe++"), ("Fe", 2))
        self.assertEqual(parse_species("Fe+++"), ("Fe", 3))
        self.assertEqual(parse_species("Cr2O7^2-"), ("Cr2O7", -2))
        self.assertEqual(parse_species("Cr2O7(2-)"), ("Cr2O7", -2))
        self.assertEqual(parse_species("H2O"), ("H2O", 0))


class TestOxidationStates(unittest.TestCase):
    def test_single_element(self):
        self.assertEqual(assign_oxidation_states("O2", 0), {"O": 0})
        self.assertEqual(assign_oxidation_states("Fe", 0), {"Fe": 0})
        self.assertEqual(assign_oxidation_states("Fe", 2), {"Fe": 2})
        self.assertEqual(assign_oxidation_states("Cl", -1), {"Cl": -1})
        
    def test_simple_compounds(self):
        self.assertEqual(assign_oxidation_states("H2O", 0), {"H": 1, "O": -2})
        self.assertEqual(assign_oxidation_states("CO2", 0), {"C": 4, "O": -2})
        self.assertEqual(assign_oxidation_states("SF6", 0), {"S": 6, "F": -1})
        
    def test_ions(self):
        self.assertEqual(assign_oxidation_states("MnO4", -1), {"Mn": 7, "O": -2})
        self.assertEqual(assign_oxidation_states("Cr2O7", -2), {"Cr": 6, "O": -2})
        
    def test_complex_neutral_compounds(self):
        # Splitting logic verification
        self.assertEqual(assign_oxidation_states("FeSO4", 0), {"Fe": 2, "S": 6, "O": -2})
        self.assertEqual(assign_oxidation_states("Fe2(SO4)3", 0), {"Fe": 3, "S": 6, "O": -2})
        self.assertEqual(assign_oxidation_states("KMnO4", 0), {"K": 1, "Mn": 7, "O": -2})
        
    def test_peroxides_superoxides(self):
        self.assertEqual(assign_oxidation_states("H2O2", 0), {"H": 1, "O": -1})
        self.assertEqual(assign_oxidation_states("Na2O2", 0), {"Na": 1, "O": -1})
        self.assertEqual(assign_oxidation_states("KO2", 0), {"K": 1, "O": -0.5})


class TestReactionBalancing(unittest.TestCase):
    def setUp(self):
        self.solver = RedoxSolver()
        
    def test_balance_neutral_auto(self):
        eq = "Cu + Ag+ -> Cu2+ + Ag"
        balanced = self.solver.balance_reaction(eq)
        self.assertEqual(balanced, "Cu + 2 Ag+ -> Cu2+ + 2 Ag")
        
        eq2 = "H2 + O2 -> H2O"
        balanced2 = self.solver.balance_reaction(eq2)
        self.assertEqual(balanced2, "2 H2 + O2 -> 2 H2O")
        
    def test_balance_acidic(self):
        eq = "MnO4- + Fe2+ -> Mn2+ + Fe3+"
        balanced = self.solver.balance_reaction(eq, "acidic")
        # MnO4- + 5 Fe2+ + 8 H+ -> Mn2+ + 5 Fe3+ + 4 H2O
        self.assertIn("MnO4-", balanced)
        self.assertIn("5 Fe2+", balanced)
        self.assertIn("8 H+", balanced)
        self.assertIn("Mn2+", balanced)
        self.assertIn("5 Fe3+", balanced)
        self.assertIn("4 H2O", balanced)
        
    def test_balance_basic(self):
        eq = "MnO4- + Fe2+ -> Mn2+ + Fe3+"
        balanced = self.solver.balance_reaction(eq, "basic")
        # MnO4- + 5 Fe2+ + 4 H2O -> Mn2+ + 5 Fe3+ + 8 OH-
        self.assertIn("MnO4-", balanced)
        self.assertIn("5 Fe2+", balanced)
        self.assertIn("4 H2O", balanced)
        self.assertIn("Mn2+", balanced)
        self.assertIn("5 Fe3+", balanced)
        self.assertIn("8 OH-", balanced)


class TestRedoxAnalysis(unittest.TestCase):
    def setUp(self):
        self.solver = RedoxSolver()
        
    def test_analysis_simple(self):
        eq = "MnO4- + Fe2+ -> Mn2+ + Fe3+"
        analysis = self.solver.analyze_reaction(eq, "acidic")
        
        # Verify agents
        self.assertEqual(analysis["reducing_agents"], ["Fe2+"])
        self.assertEqual(analysis["oxidizing_agents"], ["MnO4-"])
        
        # Verify oxidation states
        self.assertEqual(analysis["reactant_oxidation_states"]["MnO4-"]["Mn"], 7)
        self.assertEqual(analysis["product_oxidation_states"]["Mn2+"]["Mn"], 2)
        self.assertEqual(analysis["reactant_oxidation_states"]["Fe2+"]["Fe"], 2)
        self.assertEqual(analysis["product_oxidation_states"]["Fe3+"]["Fe"], 3)
        
        # Verify redox details
        oxidized = analysis["oxidized_elements"]
        self.assertTrue(any(item["element"] == "Fe" and item["from_ox"] == 2 and item["to_ox"] == 3 for item in oxidized))
        
        reduced = analysis["reduced_elements"]
        self.assertTrue(any(item["element"] == "Mn" and item["from_ox"] == 7 and item["to_ox"] == 2 for item in reduced))


if __name__ == "__main__":
    unittest.main()
