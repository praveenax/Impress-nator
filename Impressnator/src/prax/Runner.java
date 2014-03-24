package prax;

import java.awt.Color;
import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Menu;
import java.awt.MenuBar;
import java.awt.MenuItem;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.event.MenuEvent;
import javax.swing.event.MenuListener;

public class Runner extends JFrame implements ActionListener {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static void main(String[] args) {

		initGUI();

	}

	static JFrame frame;
	static JPanel mainPanel;

	private static void initGUI() {
		int screenWidth = (int) Math.abs(java.awt.Toolkit.getDefaultToolkit()
				.getScreenSize().getWidth());
		int screenHeight = (int) Math.abs(java.awt.Toolkit.getDefaultToolkit()
				.getScreenSize().getHeight());
		frame = new JFrame();
		frame = new JFrame("Impressnator V 1.0");

		MenuBar mb = new MenuBar();
		
		ActionListener al = new Runner();
		
		Menu m = new Menu();
		MenuItem mi = new MenuItem();
		mi.setLabel("New Presentation");
		
		mi.addActionListener(al);
		
		
		mi.setName("New");
		m.add(mi);
		m.setLabel("New");
		mb.add(m);

		
		frame.setMenuBar(mb);

		mainPanel = new JPanel();

		JDesktopPane pane = new JDesktopPane();
		
		JInternalFrame intFrame = new JInternalFrame("Can Do All", true, true,
				true, true);
		intFrame.setBounds(10, 50, 100, 50);
		pane.add(intFrame);
		intFrame.setVisible(true);

		JTextField tField1 = new JTextField();
		JLabel label1 = new JLabel();

		label1.setText("Label Name:");
		tField1.setColumns(50);

		mainPanel.add(label1);
		mainPanel.add(tField1);
		mainPanel.setBounds(0, 0, 200, 50);
		pane.add(mainPanel);

		frame.add(pane);

		// System.out.println(java.awt.Toolkit.getDefaultToolkit().getScreenSize().getWidth()+"  "+java.awt.Toolkit.getDefaultToolkit().getScreenSize().getHeight());

		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(screenWidth, screenHeight-200);
		frame.setVisible(true);

	}

	@Override
	public void actionPerformed(ActionEvent ae) {
		
		System.out.println(ae.getSource());
		
		
		
		
	}
	
	

	

}
