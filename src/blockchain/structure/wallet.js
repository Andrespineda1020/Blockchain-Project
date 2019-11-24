
//Node Class
  class Node {
      // constructor for a node (transaction) in our blockchain
      constructor(name1 , name2, value1, value2) {
          this.name1 = name1;
          this.name2 = name2;
          this.user1Value = value1;
          this.user2Value = value2;
          this.next = null
      }
  }

  // linkedlist class
  class LinkedList {
      constructor()
      {
          this.head = null;
          this.size = 0;
      }
      // adds a transaction to the end of the list
      add(element)
      {
          // creates a new node
          var node = new Node(name1,name2, value1, value2);

          // to store current node
          var current;

          // if list is Empty add the
          // element and make it head
          if (this.head == null)
              this.head = node;
          else {
              current = this.head;

              // iterate to the end of the
              // list
              while (current.next) {
                  current = current.next;
              }
              // adds the transaction
              current.next = node;
          }
          this.size++;
      }


  // removes the last transaction on the ledger.
  removeElement(element)
  {
      var current = this.head;
      var prev = null;

      // iterate over the list
      while (current != null) {
          // comparing element with current
          // element if found then remove the
          // and return true
          if (current.element == = element) {
              if (prev == null) {
                  this.head = current.next;
              } else {
                  prev.next = current.next;
              }
              this.size--;
              return current.element;
          }
          prev = current;
          current = current.next;
      }
      return -1;
  }


// checks if the ledger is empty.
isEmpty()
{
    return this.size == 0;
}

// prints all the transaction in the ledger.
printList()
{
    var curr = this.head;
    var str = "";
    while (curr) {
        str = str+ curr.name1 + " " + "sends " + curr.name2 + " " + curr.user1Value + " and " + curr.name2 + " " + "sends " + curr.name1 + " " + curr.user2Value;
        curr = curr.next;
    }
    console.log(str);
}
  }
