import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
 
public class PredictiveTextGenerator {
 
   private static final int CONTEXT_SIZE = 2; // Adjust context size based on your needs
   private Map<String, Map<String, Integer>> nGrams = new HashMap<>();
 
   public void train(String text) {
       String[] words = text.split("\\s+");
 
       for (int i = 0; i < words.length - CONTEXT_SIZE; i++) {
           String[] context = new String[CONTEXT_SIZE];
           System.arraycopy(words, i, context, 0, CONTEXT_SIZE);
 
           String nextWord = words[i + CONTEXT_SIZE];
 
           // Convert to lowercase for case-insensitive behavior
           String contextKey = String.join(" ", context).toLowerCase();
 
           nGrams.computeIfAbsent(contextKey, k -> new HashMap<>());
           nGrams.get(contextKey).merge(nextWord.toLowerCase(), 1, Integer::sum);
       }
   }
 
   public String generate(String input) {
       if (input.isEmpty()) {
           return "Input is empty.";
       }
 
       String[] context = input.split("\\s+");
 
       if (context.length != CONTEXT_SIZE) {
           return "Invalid input context size.";
       }
 
       // Convert to lowercase for case-insensitive behavior
       String contextKey = String.join(" ", context).toLowerCase();
       Map<String, Integer> nextWords = nGrams.get(contextKey);
 
       if (nextWords == null) {
           return "No predictions for the given context.";
       }
 
       // Find the most likely next word
       String predictedWord = nextWords.entrySet().stream()
               .max(Map.Entry.comparingByValue())
               .map(Map.Entry::getKey)
               .orElse("No prediction");
 
       return predictedWord;
   }
 
   public static void main(String[] args) {
       PredictiveTextGenerator generator = new PredictiveTextGenerator();
 
       // Train the model with some example text
       generator.train("This is an example sentence. This sentence demonstrates the predictive text generator.");
 
       // Take user input and generate predictions
       Scanner scanner = new Scanner(System.in);
 
       while (true) {
           System.out.print("Enter a context (2 words): ");
           String input = scanner.nextLine();
 
           if (input.equals("exit")) {
               break;
           }
 
           String prediction = generator.generate(input);
           System.out.println("Predicted next word: " + prediction);
       }
 
       scanner.close();
   }
}
 
 
 
