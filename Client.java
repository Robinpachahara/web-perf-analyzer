import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

//Java command line interface - Client
public class Client {
	public static void main(String args[]) throws Exception {

		System.out.print("> ");
		Scanner scanner = new Scanner(System.in);
		String userInput;
		String[] tokens = null;
		while (true) {
			userInput = scanner.nextLine();
			tokens = userInput.split(" ");
			System.out.println(userInput);
			if (tokens[0].equals("help")) {
				System.out.println("Supported commands:");
				System.out.println("1. testSites <site1>, <site2>,..., <siteN>, number of iterations");
				System.out.println("2. getStatus <handle>");
				System.out.println("3. getResults <handle>");
				System.out.println("4. getAll");
				System.out.println("5. exit");
			} else if (tokens[0].equals("testSites")) {
				Map<String, String> data = new HashMap<String, String>();
				// Last value is the number of iterations - DID NOT IMPLEMENT
				// JSON DEPENDENCY
				String siteName = "[";
				for (int i = 1; i < tokens.length - 1; i++) {
					siteName += tokens[i] + ",";
				}
				siteName += "]";
				data.put("sitesToTest", siteName);
				data.put("iterations", (tokens[tokens.length - 1]));
				HttpRequest testSitesRequest = HttpRequest.post("https://localhost:8000/startTest");
				testSitesRequest.accept("application/json");
				testSitesRequest.trustAllCerts();
				testSitesRequest.trustAllHosts();
				testSitesRequest.form(data);
				System.out.println("Test started. Test Handle: " + testSitesRequest.body());
			} else if (tokens[0].equals("getStatus")) {
				HttpRequest getStatusRequest = HttpRequest.get("https://localhost:8000/testStatus", true, "testHandle",
						tokens[1]);
				getStatusRequest.trustAllCerts();
				getStatusRequest.trustAllHosts();
				System.out.println(getStatusRequest.body());
			} else if (tokens[0].equals("getResults")) {
				HttpRequest getResultsRequest = HttpRequest.get("https://localhost:8000/testResults", true,
						"testHandle", tokens[1]);
				getResultsRequest.trustAllCerts();
				getResultsRequest.trustAllHosts();
				System.out.println(getResultsRequest.body());
			} else if (tokens[0].equals("getAll")) {
				HttpRequest getAllRequest = HttpRequest.get("https://localhost:8000/allTests");
				getAllRequest.trustAllCerts();
				getAllRequest.trustAllHosts();
				System.out.println(getAllRequest.body());
			} else if (tokens[0].equals("exit")) {
				scanner.close();
				break;
			} else {
				System.out.println("Command does not exist. Please try 'help'");
			}
			System.out.print("> ");
		}
	}
}
