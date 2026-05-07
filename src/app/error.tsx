"use client";
export default function Error() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#030712",color:"#f1f5f9"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:"6rem",fontWeight:900,margin:0}}>500</h1>
        <p style={{opacity:0.6}}>Something went wrong</p>
        <a href="/" style={{color:"#06b6d4",display:"block",marginTop:"2rem"}}>Go home</a>
      </div>
    </div>
  );
}