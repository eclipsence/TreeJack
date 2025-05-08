from models import DecisionTree, Node

# Basic age-based example
age_check_tree = DecisionTree(
    root=Node(
        node_id="start",
        text="Start",
        condition=None,
        children=[
            Node(
                node_id="age_check",
                text="Age >= 18?",
                condition="input.age >= 18",
                children=[
                    Node(
                        node_id="adult",
                        text="You are an adult.",
                        condition=None,
                        children=[]
                    )
                ]
            ),
            Node(
                node_id="minor",
                text="You are a minor.",
                condition="input.age < 18",
                children=[]
            )
        ]
    )
)

# Loan application example
loan_application_tree = DecisionTree(
    root=Node(
        node_id="start",
        text="Loan Application",
        condition=None,
        children=[
            Node(
                node_id="income_check",
                text="Annual Income Check",
                condition="input.annual_income >= 30000",
                children=[
                    Node(
                        node_id="credit_score_check",
                        text="Credit Score Check",
                        condition="input.credit_score >= 700",
                        children=[
                            Node(
                                node_id="loan_approved",
                                text="Loan Approved",
                                condition=None,
                                children=[]
                            )
                        ]
                    ),
                    Node(
                        node_id="credit_score_low",
                        text="Credit Score Low",
                        condition="input.credit_score < 700",
                        children=[
                            Node(
                                node_id="loan_rejected",
                                text="Loan Rejected - Low Credit Score",
                                condition=None,
                                children=[]
                            )
                        ]
                    )
                ]
            ),
            Node(
                node_id="income_too_low",
                text="Income Too Low",
                condition="input.annual_income < 30000",
                children=[
                    Node(
                        node_id="loan_rejected",
                        text="Loan Rejected - Low Income",
                        condition=None,
                        children=[]
                    )
                ]
            )
        ]
    )
)

# E-commerce product recommendation
recommendation_tree = DecisionTree(
    root=Node(
        node_id="start",
        text="Product Recommendation",
        condition=None,
        children=[
            Node(
                node_id="category_check",
                text="Category Selection",
                condition="input.category == 'electronics'",
                children=[
                    Node(
                        node_id="budget_check",
                        text="Budget Check",
                        condition="input.budget >= 1000",
                        children=[
                            Node(
                                node_id="premium_electronics",
                                text="Premium Electronics",
                                condition=None,
                                children=[]
                            )
                        ]
                    ),
                    Node(
                        node_id="budget_low",
                        text="Budget Low",
                        condition="input.budget < 1000",
                        children=[
                            Node(
                                node_id="budget_electronics",
                                text="Budget Electronics",
                                condition=None,
                                children=[]
                            )
                        ]
                    )
                ]
            ),
            Node(
                node_id="clothing_check",
                text="Clothing Category",
                condition="input.category == 'clothing'",
                children=[
                    Node(
                        node_id="gender_check",
                        text="Gender Preference",
                        condition="input.gender == 'male'",
                        children=[
                            Node(
                                node_id="mens_clothing",
                                text="Men's Clothing",
                                condition=None,
                                children=[]
                            )
                        ]
                    ),
                    Node(
                        node_id="womens_clothing",
                        text="Women's Clothing",
                        condition="input.gender == 'female'",
                        children=[]
                    )
                ]
            )
        ]
    )
)

# Complex loan application tree with multiple decision paths
complex_loan_tree = DecisionTree(
    root=Node(
        node_id="start",
        text="Loan Application Evaluation",
        condition=None,
        children=[
            Node(
                node_id="initial_screening",
                text="Initial Screening",
                condition="input.has_applied_before != True",
                children=[
                    Node(
                        node_id="age_verification",
                        text="Age Verification",
                        condition="input.age >= 21",
                        children=[
                            Node(
                                node_id="income_evaluation",
                                text="Income Evaluation",
                                condition="input.annual_income >= 45000",
                                children=[
                                    Node(
                                        node_id="credit_score_check",
                                        text="Credit Score Evaluation",
                                        condition="input.credit_score >= 650",
                                        children=[
                                            Node(
                                                node_id="debt_ratio_check",
                                                text="Debt-to-Income Ratio Evaluation",
                                                condition="input.debt_to_income_ratio < 0.4",
                                                children=[
                                                    Node(
                                                        node_id="employment_verification",
                                                        text="Employment Verification",
                                                        condition="input.employment_years >= 2",
                                                        children=[
                                                            Node(
                                                                node_id="loan_amount_check",
                                                                text="Loan Amount Evaluation",
                                                                condition="input.loan_amount <= input.annual_income * 0.8",
                                                                children=[
                                                                    Node(
                                                                        node_id="approved_high_priority",
                                                                        text="Approved - High Priority",
                                                                        condition="input.credit_score >= 750 and input.employment_years >= 5",
                                                                        children=[]
                                                                    ),
                                                                    Node(
                                                                        node_id="approved_medium_priority",
                                                                        text="Approved - Medium Priority",
                                                                        condition="input.credit_score >= 700",
                                                                        children=[]
                                                                    ),
                                                                    Node(
                                                                        node_id="approved_low_priority",
                                                                        text="Approved - Low Priority",
                                                                        condition=None,
                                                                        children=[]
                                                                    )
                                                                ]
                                                            ),
                                                            Node(
                                                                node_id="loan_amount_too_high",
                                                                text="Rejected - Loan Amount Too High",
                                                                condition=None,
                                                                children=[]
                                                            )
                                                        ]
                                                    ),
                                                    Node(
                                                        node_id="employment_too_short",
                                                        text="Employment History Too Short",
                                                        condition=None,
                                                        children=[
                                                            Node(
                                                                node_id="exception_review",
                                                                text="Exception Review",
                                                                condition="input.has_collateral == True and input.credit_score >= 720",
                                                                children=[
                                                                    Node(
                                                                        node_id="approved_with_exceptions",
                                                                        text="Approved with Exceptions",
                                                                        condition=None,
                                                                        children=[]
                                                                    )
                                                                ]
                                                            ),
                                                            Node(
                                                                node_id="rejected_short_employment",
                                                                text="Rejected - Insufficient Employment History",
                                                                condition=None,
                                                                children=[]
                                                            )
                                                        ]
                                                    )
                                                ]
                                            ),
                                            Node(
                                                node_id="debt_ratio_too_high",
                                                text="Rejected - Debt Ratio Too High",
                                                condition=None,
                                                children=[]
                                            )
                                        ]
                                    ),
                                    Node(
                                        node_id="credit_score_too_low",
                                        text="Credit Score Below Threshold",
                                        condition=None,
                                        children=[
                                            Node(
                                                node_id="guarantor_option",
                                                text="Guarantor Option",
                                                condition="input.has_guarantor == True",
                                                children=[
                                                    Node(
                                                        node_id="guarantor_evaluation",
                                                        text="Guarantor Evaluation",
                                                        condition="input.guarantor_credit_score >= 700",
                                                        children=[
                                                            Node(
                                                                node_id="approved_with_guarantor",
                                                                text="Approved with Guarantor",
                                                                condition=None,
                                                                children=[]
                                                            )
                                                        ]
                                                    ),
                                                    Node(
                                                        node_id="guarantor_rejected",
                                                        text="Guarantor Rejected",
                                                        condition=None,
                                                        children=[]
                                                    )
                                                ]
                                            ),
                                            Node(
                                                node_id="credit_score_rejected",
                                                text="Rejected - Low Credit Score",
                                                condition=None,
                                                children=[]
                                            )
                                        ]
                                    )
                                ]
                            ),
                            Node(
                                node_id="income_too_low",
                                text="Income Below Threshold",
                                condition=None,
                                children=[
                                    Node(
                                        node_id="cosigner_option",
                                        text="Co-signer Option",
                                        condition="input.has_cosigner == True",
                                        children=[
                                            Node(
                                                node_id="cosigner_evaluation",
                                                text="Co-signer Evaluation",
                                                condition="input.cosigner_income >= 60000 and input.cosigner_credit_score >= 680",
                                                children=[
                                                    Node(
                                                        node_id="approved_with_cosigner",
                                                        text="Approved with Co-signer",
                                                        condition=None,
                                                        children=[]
                                                    )
                                                ]
                                            ),
                                            Node(
                                                node_id="cosigner_rejected",
                                                text="Co-signer Rejected",
                                                condition=None,
                                                children=[]
                                            )
                                        ]
                                    ),
                                    Node(
                                        node_id="income_rejected",
                                        text="Rejected - Insufficient Income",
                                        condition=None,
                                        children=[]
                                    )
                                ]
                            )
                        ]
                    ),
                    Node(
                        node_id="under_age",
                        text="Rejected - Below Minimum Age",
                        condition=None,
                        children=[]
                    )
                ]
            ),
            Node(
                node_id="previous_applicant",
                text="Previous Applicant Review",
                condition=None,
                children=[
                    Node(
                        node_id="previous_application_check",
                        text="Previous Application Status Check",
                        condition="input.previous_application_status == 'completed'",
                        children=[
                            Node(
                                node_id="time_since_previous",
                                text="Time Since Previous Application",
                                condition="input.months_since_previous >= 6",
                                children=[
                                    Node(
                                        node_id="escalate_to_manager",
                                        text="Escalate to Manager Review",
                                        condition=None,
                                        children=[]
                                    )
                                ]
                            ),
                            Node(
                                node_id="rejected_too_recent",
                                text="Rejected - Too Recent Previous Application",
                                condition=None,
                                children=[]
                            )
                        ]
                    ),
                    Node(
                        node_id="incomplete_previous",
                        text="Previous Application Incomplete",
                        condition=None,
                        children=[
                            Node(
                                node_id="restart_application",
                                text="Restart Application Process",
                                condition=None,
                                children=[]
                            )
                        ]
                    )
                ]
            )
        ]
    )
)

# Sample inputs for the complex loan tree
complex_loan_sample_inputs = [
    {
        "name": "High Priority Approval Path",
        "input_values": {
            "has_applied_before": False,
            "age": 30,
            "annual_income": 95000,
            "credit_score": 780,
            "debt_to_income_ratio": 0.25,
            "employment_years": 6,
            "loan_amount": 70000
        }
    },
    {
        "name": "Medium Priority Approval Path",
        "input_values": {
            "has_applied_before": False,
            "age": 27,
            "annual_income": 65000,
            "credit_score": 720,
            "debt_to_income_ratio": 0.3,
            "employment_years": 3,
            "loan_amount": 45000
        }
    },
    {
        "name": "Low Priority Approval Path",
        "input_values": {
            "has_applied_before": False,
            "age": 23,
            "annual_income": 50000,
            "credit_score": 680,
            "debt_to_income_ratio": 0.35,
            "employment_years": 2,
            "loan_amount": 30000
        }
    },
    {
        "name": "Approved with Exceptions Path",
        "input_values": {
            "has_applied_before": False,
            "age": 25,
            "annual_income": 60000,
            "credit_score": 730,
            "debt_to_income_ratio": 0.3,
            "employment_years": 1.5,
            "has_collateral": True
        }
    },
    {
        "name": "Approved with Guarantor Path",
        "input_values": {
            "has_applied_before": False,
            "age": 22,
            "annual_income": 48000,
            "credit_score": 620,
            "debt_to_income_ratio": 0.3,
            "employment_years": 2,
            "loan_amount": 25000,
            "has_guarantor": True,
            "guarantor_credit_score": 750
        }
    },
    {
        "name": "Approved with Co-signer Path",
        "input_values": {
            "has_applied_before": False,
            "age": 24,
            "annual_income": 40000,
            "has_cosigner": True,
            "cosigner_income": 75000,
            "cosigner_credit_score": 740
        }
    },
    {
        "name": "Rejected - Loan Amount Too High",
        "input_values": {
            "has_applied_before": False,
            "age": 28,
            "annual_income": 55000,
            "credit_score": 700,
            "debt_to_income_ratio": 0.3,
            "employment_years": 3,
            "loan_amount": 65000
        }
    },
    {
        "name": "Rejected - Low Credit Score",
        "input_values": {
            "has_applied_before": False,
            "age": 30,
            "annual_income": 58000,
            "credit_score": 580,
            "has_guarantor": False
        }
    },
    {
        "name": "Previous Applicant Path",
        "input_values": {
            "has_applied_before": True,
            "previous_application_status": "completed",
            "months_since_previous": 8
        }
    },
    {
        "name": "Unreachable Path Test",
        "input_values": {
            "has_applied_before": False,
            "age": 19,
            "annual_income": 100000,
            "credit_score": 800
        }
    }
]

example_trees = {
    "age_check": age_check_tree,
    "loan_application": loan_application_tree,
    "product_recommendation": recommendation_tree,
    "complex_loan": complex_loan_tree
}

# Include the default sample inputs for the complex loan tree
complex_loan_tree.sample_inputs = complex_loan_sample_inputs 