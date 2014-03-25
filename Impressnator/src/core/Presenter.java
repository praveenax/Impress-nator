package core;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;



public class Presenter
{

	static String		topContent	= "";
	static String		botContent	= "";


	public static void main (String[] args) throws IOException
	{

		Presentation present = new Presentation();

		Scanner sc = new Scanner(System.in);

		p("Enter presenation name:");

		present.setpName(sc.nextLine());

		boolean endCondition = false;
		List<Slide> slideList = new ArrayList<Slide>();
		int slideCount = 1;
		while (!endCondition)
		{

			Slide slide = new Slide();
			p("Enter slide content:");

			slide.setSlideNumber(slideCount);
			slide.setContent(sc.nextLine());
			p("Enter the slide orientation (U or D or R or L):");

			String transDirection = sc.nextLine();
			detTransDirection(slide, transDirection);

			p("Enter slide rotation direction:(FR,FL,UD)");
			String rotate = sc.nextLine();
			detRotate(slide, rotate);

			p("Over? Y/N");
			if (sc.nextLine().equals("Y"))
			{
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

	private static void detRotate (Slide slide, String transDirection)
	{

		if (transDirection.equals("FR"))
		{

			slide.setRotate(90);
		}
		else if (transDirection.equals("FL"))
		{
			slide.setRotate(-90);
		}
		else if (transDirection.equals("UD"))
		{
			slide.setRotate(180);

		}
		else
		{
			slide.setRotate(0);

		}
	}

	private static void detTransDirection (Slide slide, String transDirection)
	{

		if (transDirection.equals("U"))
		{
			slide.setyCod(-1000);
			slide.setxCod(0);
		}
		else if (transDirection.equals("D"))
		{
			slide.setyCod(1000);
			slide.setxCod(0);
		}
		else if (transDirection.equals("R"))
		{
			slide.setxCod(1500);
			slide.setyCod(0);
		}
		else if (transDirection.equals("L"))
		{
			slide.setxCod(-1500);
			slide.setyCod(0);
		}
		else
		{

			slide.setxCod(0);
			slide.setyCod(0);

		}
	}

	private static void loadBotSection () throws IOException
	{

		FileReader fr = new FileReader(new File(StrConst.botFile));
		BufferedReader br = new BufferedReader(fr);

		String sCurrentLine;
		while ((sCurrentLine = br.readLine()) != null)
		{

			botContent = botContent + "\n" + sCurrentLine;

		}

	}

	private static void loadTopSection () throws IOException
	{

		FileReader fr = new FileReader(new File(StrConst.topFile));
		BufferedReader br = new BufferedReader(fr);

		String sCurrentLine;
		while ((sCurrentLine = br.readLine()) != null)
		{

			topContent = topContent + "\n" + sCurrentLine;

		}

	}

	private static void printFile (Presentation present) throws IOException
	{

		List<Slide> slList = present.getSlideList();
		File file = new File("res\\Out.html");
		FileWriter fw = new FileWriter(file);
		BufferedWriter bw = new BufferedWriter(fw);
		bw.append(topContent);

		setTitle(present, bw);

		setSlides(slList, bw);

		bw.append(botContent);
		bw.close();

	}

	private static void setSlides (List<Slide> slList, BufferedWriter bw) throws IOException
	{

		int slideCount = 0;
		int xCod = 1000;
		int yCod = 1000;
		int rot = 0;
		for (Slide slide : slList)
		{
			yCod = yCod + slide.getyCod();
			xCod = xCod + slide.getxCod();
			rot = rot + slide.getRotate();
			slideCount++;

			setDataContent(bw, slideCount, xCod, yCod, slide, rot);

		}
	}

	private static void setTitle (Presentation present, BufferedWriter bw) throws IOException
	{

		bw.append("<div id=\""
			+ "title\" class=\"step slide \"  data-x=\"1000\" data-y=\"1000\" data-z=\"0\" data-rotate-x=\"0\" data-rotate-y=\"0\" data-scale=\"1\">"
			+ "\n");
		bw.append("<q style=\"text-align:center;\">" + present.getpName() + "\n" + "</q><br>");

		bw.append(StrConst.endTag);
	}

	private static void setDataContent (BufferedWriter bw, int slideCount, int xCod, int yCod, Slide slide, int rot)
		throws IOException
	{

		String divHeader = "<div id=\"" + "id" + slideCount + "\" class=\"step slide \"  data-x=\"" + xCod + "\" data-y=\"" + yCod
			+ "\" data-z=\"0\" data-rotate-z=\"" + rot + "\" data-rotate-x=\"0\" data-scale=\"1\">";

		bw.append(divHeader + "\n");
		bw.append(slide.getContent() + "\n");
		bw.append(StrConst.endTag);
	}

	private static void p (String value)
	{

		System.out.println(value);

	}

	

}
