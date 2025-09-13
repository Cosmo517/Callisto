use rusqlite::{Connection, Result};

pub fn init_db() -> Result<()> {
    let conn = Connection::open("./src/data/data.db")?;

    conn.execute(
        "create table if not exists users (
             id integer primary key,
             name text not null unique
         )",
        (),
    )?;
    Ok(())
}