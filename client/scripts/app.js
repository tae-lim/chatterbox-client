// YOUR CODE HERE:


let escape = (submission) => {
  //get input from user
  let input = submission.split('');
  let escapees = {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '\"' : '&quot;',
    '\'' : '&#x27;',
    '/' : '&#x2F;'
  };
  //loop through each character
  for (let i = 0; i < input.length; i++) {
    for (let key in escapees) {
      if (input[i] === key) {
        input[i] = escapees[key];
      }
    }
  }
  return input.join('');
    //if it is < > & , etc
      //replace with alt;, amp;, etc
    //return the modified string
};

// & --> &amp;
//  < --> &lt;
//  > --> &gt;
//  " --> &quot;
//   ' --> &#x27;     &apos; not recommended because its not in the HTML spec (See: section 24.4.1) &apos; is in the XML and XHTML specs.
//  / --> &#x2F;     forward slash is included as it helps end an HTML entity


//input: user submission (username, message, friend's name during search, naming a room)
//output: modified string