 // <script>
     var student = [];
 
 function showDetaill(i){
    //console.log(student[i]);
    $('#studentimg').attr('src',student[i].img);
    $('#outlink1').attr('href',student[i].total);
    $('#studentname').html(student[i].name);
    $('#studentclass').html(student[i].classstudent);
    $('#studentclassteacher').html(student[i].classteacher);  
    $('#studentthailng').html(student[i].thailng);
    // $('#studentmaths').html(student[i].maths); 
    // $('#studentenglish').html(student[i].english);
    // $('#studentcomputer').html(student[i].computer);
    // $('#studentscience').html(student[i].science);
    $('#studenttotal').html(student[i].total);
  
     }
 
     $(document).ready(function(){
       $.getJSON("https://script.google.com/macros/s/AKfycbx8fyCmoZhAoYqjAtBaZ5obRy0rdp_jYA-LeUUWSnTrLWX-wU4jzxn4adPDvYE5tPmmAQ/exec",function(result){   // เปลี่ยน exec
         student = result.student;
        //console.log(pokenmons);
     for(var i =0;i < student.length; i++){
       var li ='<li>';
        li +='<a href="#popDialog" data-rel="popup" data-position-to="#header" data-transition="pop" onclick="showDetaill('+i+')">';
        li +='<img src="'+student[i].img +'">';
        li +='<h2>'+student[i].name+'</h2>';
        li +='<p>'+student[i].classteacher+' '+student[i].classstudent+'</p>';
        li +='</a>';
        li +='</li>';
        $('ul').append(li);       
        }
        $('ul').listview('refresh');
       });
     });
 
   function goHome(){
       window.location.reload();
       //event.preventDefault()
     }
   // </script>
