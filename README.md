copyright @Microsoft Hackathon 2020

## HyperAutomation - MMX and Beyond[WIP]

 In simple words, hyperautomation refers to the mixture of automation technologies that exist to augment and expand human capabilities. 

 According to Gartner - Enterprise architecture and technology innovation leaders lack a defined strategy to scale automation with tactical and strategic goals. They must deliver end-to-end automation beyond RPA by combining complementary technologies to augment business processes.

## Problem Statement

For any business / product to be successful, it is very important to address the customer queries timely. Any delay in queries may have direct impact on the profit and the reputation of the product built  over years. 

## Solution

The solution that we are proposing is hyperautomation. First, all the feedbacks are collected at a common store , 
These feedback are in “free text “ format, from these feedbacks, we will extract the intent by running a machine learning text classification algorithm and then map these automated intents/insights derived, to the corresponding tasks to be performed and re-route them to the respective processes automatically.

## Machine Learning text classification algorithm

Python script can be found in ./scripts/text_classification.py

## UI 
 
This project is created with `npx create-react-app PROJECT_NAME`.

To run -
1. Clone this project using `git clone https://github.com/aykejriw/HyperAutomation.git`
2. Do `npm i` to install dependencies
3. Run `npm start`