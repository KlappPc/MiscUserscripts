package klapppc;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONObject;

public class Idlers {
	
	static String SEARCH = "var rgGames = ";
	static List<Idler> idlers=new ArrayList<Idler>();
	static List<Game> games=new ArrayList<Game>(); 
	static List<String> removedGames=new ArrayList<String>(); 
	static List<String> cardGames=new ArrayList<String>(); 
	
	/**
	 * Returns the complete content of the requested Website as a String.
	 * 
	 * @param purl
	 * @return
	 * @throws IOException
	 */
	public static String getBodyOf(String purl) throws IOException {
		StringBuilder bui = new StringBuilder();
		Scanner scann = getBodyOfAsScanner(purl);
		while (scann.hasNextLine()) {
			bui.append(scann.nextLine());
		}
		scann.close();
		return bui.toString();
	}

	/**
	 * Returns the complete content of the requested Website as a Scanner.
	 * 
	 * @param purl
	 * @return
	 * @throws IOException
	 */
	public static Scanner getBodyOfAsScanner(String purl) throws IOException {
		URL url = new URL(purl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
			return new Scanner(conn.getInputStream(), "UTF-8");
		} else {
			throw new IOException(conn.getResponseMessage());
		}
	}
	
	public static JSONArray findGames(String id) throws IOException {
		String complete = getBodyOf("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F9DF9B7821B26BA2BDDA220BF119D1BB&steamid="+id+"&format=json");
		JSONObject obj=new JSONObject(complete).getJSONObject("response");
		return obj.getJSONArray("games");
	}

	public static void main(String[] args) {
		String listIdlers="idlers.txt";
		String listGames="games.csv";
		String listRemovedGames="removed.txt";
		String result="result.html";
		String result2="result2.html";
		String jsonCards="STM.json";
		
		String content;
		try {
			content = new String(Files.readAllBytes(Paths.get(jsonCards)));
			JSONArray cards= new JSONObject(content).getJSONArray("sets");
			for (int i = 0; i < cards.length(); i++) {
				cardGames.add(cards.getJSONObject(i).getString("appid"));
			}
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		
		BufferedReader in;
		File file;
		String line;
		try {
		file = new File(listIdlers);
		if (file.exists()) {
			in = new BufferedReader(new FileReader(file));
			while ((line = in.readLine()) != null) {
				String[] arr=line.split(",");
				idlers.add(new Idler(arr[0], arr[1]));
			}
			in.close();
		}
		} catch (IOException e) {
			e.printStackTrace();
		}
		// all games loaded.
		try {
		file = new File(listGames);
		if (file.exists()) {
			in = new BufferedReader(new FileReader(file));
			while ((line = in.readLine()) != null) {
				games.add(new Game(line));
			}
			in.close();
		}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		try {
		file = new File(listRemovedGames);
		if (file.exists()) {
			in = new BufferedReader(new FileReader(file));
			while ((line = in.readLine()) != null) {
				removedGames.add(line.trim());
			}
			in.close();
		}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//compare
		StringBuilder bu=new StringBuilder();
		StringBuilder butmp=new StringBuilder();
		for (Iterator iterator = games.iterator(); iterator.hasNext();) {
			Game game = (Game) iterator.next();
			if(!removedGames.contains(game.id.trim())){
			int missing=0;
			for (Iterator iterator2 = idlers.iterator(); iterator2.hasNext();) {
				Idler idler = (Idler) iterator2.next();
				if(idler.games.contains(Integer.valueOf(game.id))) continue;
				missing++;
				butmp.append("<a href=http://steamcommunity.com/profiles/"+idler.id+">"+idler.name+"</a>,");
			}
			if(!cardGames.contains(game.id)){
				bu.append("-");
			}
			if (missing>0){
				butmp.setLength(butmp.length()-1);
				bu.append(missing).append("; <a href=http://store.steampowered.com/app/").append(game.id).append(">").append(game.name).append("</a>;").append(game.type).append("; ").append(butmp.toString()).append("<br />");
				butmp.setLength(0);
			}else{
				bu.append(missing).append("; <a href=http://store.steampowered.com/app/").append(game.id).append(">").append(game.name).append("</a>;").append(game.type).append(";").append("XX <br />");
			}
			}else{
				bu.append("XX").append("; <a href=http://store.steampowered.com/app/").append(game.id).append(">").append(game.name).append("</a>;").append(game.type).append(";").append("XX <br />");
			}
			
		}
		try {
			writeToFile(result, bu.toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//compare
		bu=new StringBuilder();
		butmp=new StringBuilder();
		boolean star=false;
		for (Iterator iterator2 = idlers.iterator(); iterator2.hasNext();) {
			Idler idler = (Idler) iterator2.next();
			int missing=0;
			for (Iterator iterator = games.iterator(); iterator.hasNext();) {
				Game game = (Game) iterator.next();
				if(removedGames.contains(game.id.trim())) continue;
				if(idler.games.contains(Integer.valueOf(game.id)) || !game.type.startsWith("BUNDLE") || game.type.startsWith("WHOLESALE")|| game.type.startsWith("DEMAND")|| game.type.startsWith("MYDEALZ")) continue;
				missing++;
				butmp.append(game.name);
				if(game.type.equals("OWNED")){
					butmp.append("*");
					star=true;
				}
				butmp.append(" (http://store.steampowered.com/app/").append(game.id).append(")").append("<br />");
			}
			if (missing>0){
				butmp.setLength(butmp.length()-6);
				bu.append("<a href=http://steamcommunity.com/profiles/"+idler.id+">"+idler.name+"</a>:").append("<br />");
				if(star)
					bu.append("Hi, I can offer you the following games to idle. Games marked with * might not be availiable anymore, since offered multiple people. First come, first serves.:");
				else
					bu.append("Hi, I can offer you the following games to idle:");
				star=false;
				bu.append("<br />").append(butmp.toString()).append("<br />").append("<br />");
				butmp.setLength(0);
			}
			
		}
		try {
			writeToFile(result2, bu.toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}
	
	public static void writeToFile(String filename, String write)
			throws IOException {
		BufferedWriter bu;
		File file = new File(filename);
		if (!file.exists()) {
			if (file.getParentFile() != null && !file.getParentFile().exists())
				file.getParentFile().mkdirs();
			file.createNewFile();
		}
		bu = new BufferedWriter(new FileWriter(file));
		bu.write(write);
		bu.close();
	}
	
	public static class Idler{
		String name;
		String id;
		List games=new ArrayList<Integer>();
		
		Idler(String name, String id){
			this.name=name;
			this.id=id;
			try {
				JSONArray jarr=findGames(id);
				
				for (int i = 0; i < jarr.length(); i++) {
					int appid=jarr.getJSONObject(i).getInt("appid");
					games.add(appid);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
		
	}
	
	public static class Game{
		String id;
		String name;
		String type;
		
		Game(String line){
			String[]arr=line.split(";");
			id=arr[0];
			name=arr[1];
			type=arr[2];
		}
	}
	
}
