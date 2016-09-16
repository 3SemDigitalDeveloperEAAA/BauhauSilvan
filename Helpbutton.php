<?php
// This only contains the form you could include i your webapp to have a helpbutton.
// The values for customer_id and position should vary in the real app.
// These valus would be a cookie set by user login and a beacon placed in the store 
// Method should be changed to POST when you dont need the
//  values in the address line for testing.   (DONE)
?>
<html>
 <form method="POST" action="help.php" >
   <input type="hidden" name="customer_id" value="4" />
   <input type="hidden" name="position" value="24" />
   <input type="submit" id="help" value="HELP" />
 </form>
</html>

