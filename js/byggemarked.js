$(function() {

  // SETUP
  var $list, $newItemForm, $newItemButton;
  var item = '';                                 // item is an empty string
  var undo=false;
  $list = $('ul');                               // Cache the unordered list
  $newItemForm = $('#newItemForm');              // Cache form to add new items
  $newItemButton = $('#newItemButton');          // Cache button to show form
  $('#alert').fadeOut();
  
  if(localStorage.getItem('todos')) {
    $('#todos').html(localStorage.getItem('todos'));
  }

  $('li').hide().each(function(index) {          // Hide list items
    $(this).delay(450 * index).fadeIn(1200);     // Then fade them in
  });

  // ITEM COUNTER
  function updateCount() {                       // Create function to update counter
    var items = $('li[class!=complete]').length; // Number of items in list
    $('#counter').text(items);                   // Added into counter circle
    var todos = $('#todos').html();
    localStorage.setItem('todos', todos);
  }
  updateCount();                                 // Call the function
  undo=false;

  // SETUP FORM FOR NEW ITEMS
  $newItemButton.show();                         // Show the button
  $newItemForm.hide();                           // Hide the form
  $('#showForm').on('click', function() {        // When click on add item button
    $newItemButton.hide();                       // Hide the button
    $newItemForm.show();                         // Show the form
    $newItemForm.find("#itemDescription").focus();    // setfokus
  });

  // ADDING A NEW LIST ITEM
  $newItemForm.on('submit', function(e) {       // When a new item is submitted
    e.preventDefault();                         // Prevent form being submitted
    var text = $('input:text').val();           // Get value of text input

//  next 8 lines from
//  http://www.webdesignerdepot.com/2013/04/how-to-use-local-storage-for-javascript/
    if(text == '') {
      $('#alert').html("<strong>HEY</strong> You can't remember nothing");
      $('#alert').fadeIn().delay(1000).fadeOut();
      return false;
    }


    $list.prepend('<li>' + text + '</li>');  
    $("ul li").slice(0,1).css("height","10px").animate({
       height:'50px'
    },500);

    $('input:text').val('');                    // Empty the text input
    updateCount();                              // Update the count
  });

/////  create undo function
  $list.on('click', 'li .undo', function() {
    var $this = $(this);               // Cache the element in a jQuery object
    var text = $this.text();           // Get value of text 
    undo=true;
    $this.css("position","relative");
    $this.next().animate({    // animate next element UP
      marginTop:'-60px'
    },500,"swing", function(){
      $this.next().css("margin-top","0px");
 
    });
    $this.parent().parent().animate({
      marginTop: '+60px'
    },500,"swing", function(){
      $this.parent().parent().css("margin-top","0px");
    });

    $this.animate({           // animate this element DOWN       
      opacity: 0.8,
      top: '-=' + Math.round( $list.height()-$this.index()*55-50)
    }, 500, 'swing', function() {    // Use callback when animation completes
      $this.next().css("margin-top","0px");
      $this.remove();                // Then completely remove this item
  //    $list                            // Add back to end of list as complete
  //      .append('<li class=\"complete\"><div class=\"undo\">' + item + '</div></li>');

    $list.prepend('<li>' + text + '</li>');  
      updateCount();                   // Update the counter
   
    })

  });


  // CLICK HANDLING - USES DELEGATION ON <ul> ELEMENT
  $list.on('click', 'li', function() {
    var $this = $(this);               // Cache the element in a jQuery object
    var complete = $this.hasClass('complete');  // Is item complete

    if (complete === true) {           // Check if item is complete
      if(!undo){
        slide=180;
      } else {
        slide=0;
        undo=false;
      }
      $this.animate({                  // If so, animate opacity + padding
        opacity: 0.0,
        paddingLeft: '+=' + slide
      }, 500, 'swing', function() {    // Use callback when animation completes
//        $this.next().css("margin-top","50px");
        $this.next().animate({marginTop:'50px'},1);
        $this.next().animate({marginTop:'0px'},500);
        $this.remove();                // Then completely remove this item
        updateCount();                   // Update the counter        
      });
    } else {                           // Otherwise indicate it is complete
      item = $this.text();             // Get the text from the list item
      $this.css("position","relative");
      $this.next().animate({    // animate next element UP
        marginTop:'-60px'
      },500,"swing", function(){
        $this.next().css("margin-top","0px");
      });
      $this.animate({           // animate this element DOWN       
        opacity: 0.2,
        top: '+=' + Math.round( $list.height()-$this.index()*55-50)
      }, 500, 'swing', function() {    // Use callback when animation completes
        $this.remove();                // Then completely remove this item
        $list                            // Add back to end of list as complete
          .append('<li class=\"complete\"><div class=\"undo\">' + item + '</div></li>');
        updateCount();                   // Update the counter
      });
    }                                  // End of else option
  });                                  // End of event handler

});