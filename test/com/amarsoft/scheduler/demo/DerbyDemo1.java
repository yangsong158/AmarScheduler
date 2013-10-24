package com.amarsoft.scheduler.demo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.amarsoft.are.ARE;

public class DerbyDemo1 {

	public DerbyDemo1() {
	}

	@BeforeClass
	public static void init(){
		ARE.setProperty("APP_HOME", "./WebContent/WEB-INF");
		ARE.init("./WebContent/WEB-INF/etc/are.xml");
	}
	@Before
	public void methodPrepare(){
		System.out.println(this);
	}
//	@Test
//	public void testCreate(){
//		String driverName = "org.apache.derby.jdbc.EmbeddedDriver";
//		String url = "jdbc:derby:aschl;create=true";
//		try {
//			System.setProperty("derby.system.home", "/Users/yangsong/Documents/workspace/AmarScheduler/WebContent/database");
//			Class.forName(driverName);
//			Connection conn = DriverManager.getConnection(url);
//			Assert.assertNotNull(conn);
//		} catch (ClassNotFoundException e) {
//			e.printStackTrace();
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
//	}
	@Test
	public void testDerbyJDBC(){
		Connection conn;
		try {
			conn = ARE.getDBConnection("sdl_ds");
			Assert.assertNotNull(conn);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	@Test
	public void testInsertData(){
		String dropSQL = "drop table TASKFILE_INFO";
		String createSQL = "create table TASKFILE_INFO("
				+ "FileName varchar(80),"
				+ "FileDescribe varchar(200),"
				+ "Remark varchar(1000),"
				+ "CreateTime varchar(20),"
				+ "UpdateTime varchar(20)"
				+ ")";
		String[][] data = {
			{"import_core_task.xml","核心数据导入","2013/10/21","2013/10/21"},
			{"biz_data_clean.xml","数据清理单元","2013/10/21","2013/10/21"},
			{"customer_task1.xml","客户任务处理1","2013/10/21","2013/10/21"},
			{"credit_card_task.xml","评分卡处理","2013/10/21","2013/10/21"},
			{"after_loan.xml","贷后数据处理","2013/10/21","2013/10/21"}
		};
		try {
			Connection conn = ARE.getDBConnection("sdl_ds");
			try{
				conn.createStatement().execute(dropSQL);
			}catch (SQLException e) {}
			conn.createStatement().execute(createSQL);
			
			PreparedStatement ps = conn.prepareStatement("insert into TASKFILE_INFO(FileName,FileDescribe,Remark,CreateTime,UpdateTime) values(?,?,?,?,?)");
			for(String[] row:data){
				ps.setString(1, row[0]);
				ps.setString(2, row[1]);
				ps.setString(3, null);
				ps.setString(4, row[3]);
				ps.setString(5, row[3]);
				ps.addBatch();
			}
			ps.executeBatch();
			
			ResultSet rs = conn.createStatement().executeQuery("select count(*) from TASKFILE_INFO");
			if(rs.next()){
				Assert.assertEquals(5, rs.getInt(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
