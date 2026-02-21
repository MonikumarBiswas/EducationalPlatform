
async function navigateToDashboard() {
      const userId = localStorage.getItem("userID");
      const res = await fetch( "http://localhost:3000/selectdashboard",
        {
          method:"GET",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId
          }
        }) ;

        if(!res.ok){
          alert("Please log in first.");
          window.location.href = "login.html";
          return;
        }

        const data = await res.json() ; 

        if(data.role === "student"){
          window.location.href ="dashboard.html" ;
        }
        else if(data.role === "teacher"){
          window.location.href ="teadashboard.html" ;
        }
        else if(data.role === "admin"){
          window.location.href ="admindashboard.html" ;
        }
      }

 
      document.getElementById("dashboard").addEventListener("click", () =>{
        navigateToDashboard() ;
      }) ;

      function logout() {
        localStorage.removeItem("userID");
        window.location.href = "login.html";
      }