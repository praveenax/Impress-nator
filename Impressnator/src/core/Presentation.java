package core;

import java.util.ArrayList;
import java.util.List;

public class Presentation {
	
	String pName;
	String authorName;
	
	List<Slide> slideList = new ArrayList<Slide>();

	public String getpName() {
		return pName;
	}

	public void setpName(String pName) {
		this.pName = pName;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public List<Slide> getSlideList() {
		return slideList;
	}

	public void setSlideList(List<Slide> slideList) {
		this.slideList = slideList;
	}
	
	
	

}
