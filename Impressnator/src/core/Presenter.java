package core;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class Presenter {

	static String topContent = "";
	static String botContent = "";
	

	public static void main(String[] args) throws IOException {

		Presentation present = new Presentation();

		Scanner sc = new Scanner(System.in);

		p("Enter presenation name:");

		present.setpName(sc.nextLine());

		boolean endCondition = false;
		List<Slide> slideList = new ArrayList<Slide>();
		int slideCount = 1;
		while (!endCondition) {

			Slide slide = new Slide();
			p("Enter slide content:");

			slide.setSlideNumber(slideCount);
			slide.setContent(sc.nextLine());

			p("Over? Y/N");
			if (sc.nextLine().equals("Y")) {
				endCondition = true;

			}

			slideList.add(slide);
			slideCount++;

		}

		present.setSlideList(slideList);
		loadTopSection();
		loadBotSection();
		printFile(present);

	}

	private static void loadBotSection() throws IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		FileReader fr = new FileReader(new File("bot.txt"));
		BufferedReader br = new BufferedReader(fr);

		String sCurrentLine;
		while ((sCurrentLine = br.readLine()) != null) {

			botContent = botContent + "\n" + sCurrentLine;

		}

	}

	private static void loadTopSection() throws IOException {
		// TODO Auto-generated method stub
		FileReader fr = new FileReader(new File("top.txt"));
		BufferedReader br = new BufferedReader(fr);

		String sCurrentLine;
		while ((sCurrentLine = br.readLine()) != null) {

			topContent = topContent + "\n" + sCurrentLine;

		}

	}

	private static void printFile(Presentation present) throws IOException {

		List<Slide> slList = present.getSlideList();
		File file = new File("res\\Out.html");
		FileWriter fw = new FileWriter(file);
		BufferedWriter bw = new BufferedWriter(fw);
		bw.append(topContent);

		
		int slideCount =0;
		int xCod=1000;
		int yCod=1000;
		for (Slide slide : slList) {
			
			slideCount++;
			
			String divHeader = "<div id=\""+"id"+slideCount+"\" class=\"step slide \"  data-x=\""+xCod+"\" data-y=\""+yCod+"\" data-z=\"0\" data-rotate-x=\"0\" data-rotate-y=\"0\" data-scale=\"1\">";
			String divFooter = " </div>";
			bw.append(divHeader+"\n");
			bw.append(slide.getContent() + "\n");
			bw.append(divFooter+"\n");
			yCod=yCod+2000;
			
		}

		bw.append(botContent);
		bw.close();

	}

	private static void p(String value) {

		System.out.println(value);

	}

}
