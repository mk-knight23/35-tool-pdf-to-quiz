// Simple test to verify the quiz generation works with content-based questions
const testContent = `Introduction to Machine Learning

Machine learning is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.

Key Types of Machine Learning:

1. Supervised Learning: This type uses labeled data to train algorithms. For example, email spam detection where the algorithm learns from examples of spam and non-spam emails.

2. Unsupervised Learning: This finds hidden patterns in data without labeled examples. Customer segmentation is a common example.

3. Reinforcement Learning: This method learns through trial and error, receiving rewards or penalties for actions.

Applications include:
- Medical diagnosis using medical images
- Financial trading algorithms
- Recommendation systems for e-commerce
- Natural language processing for chatbots
- Computer vision for object recognition`;

console.log("Sample content for quiz generation:");
console.log(testContent);
console.log("\nExpected questions should be about:");
console.log("- What is machine learning?");
console.log("- Types of machine learning");
console.log("- Examples of applications");
console.log("- Differences between supervised/unsupervised/reinforcement learning");