
// Create Node of LinkedList
function Node(userName) {
		this.userName = userName;
    this.rankingNum = 0;
    this.collectibles = [];
		this.next = null;

    // Key Generation Code
    //privateKey generation
    const max = Buffer.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');
    let isInvalid = true;
    let privateKey;
    while (isInvalid) {
      privateKey = secureRandom.randomBuffer(32);
      if (Buffer.compare(max, privateKey) === 1) {
        isInvalid = false;
      }
    }
// PublicKey Generation
const keys = ecdsa.keyFromPrivate(privateKey);
const publicKey = keys.getPublic('hex');

// PublicKeyHash Generation
const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');
let hash = sha256(Buffer.from(msg, 'hex'));
let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();

this.publicKeyHash = publicKeyHash;
this.publicKey= publicKey;
this.privateKey = privateKey;
this.publicAddress = createPublicAddress(publicKeyHash);
 
}

// Function to create a createPublicAddress
function createPublicAddress(publicKeyHash) {
  // step 1 - add prefix "00" in hex
  const step1 = Buffer.from("00" + publicKeyHash, 'hex');
  // step 2 - create SHA256 hash of step 1
  const step2 = sha256(step1);
  // step 3 - create SHA256 hash of step 2
  const step3 = sha256(Buffer.from(step2, 'hex'));
  // step 4 - find the 1st byte of step 3 - save as "checksum"
  const checksum = step3.substring(0, 8);
  // step 5 - add step 1 + checksum
  const step4 = step1.toString('hex') + checksum;
  // return base 58 encoding of step 5
  const address = base58.encode(Buffer.from(step4, 'hex'));
  return address;
}

// To initialize a linkedlist
function LinkedList(list) {
	this.head = list || null
}

// Function to insert The new Node into the linkedList (blockchain)
LinkedList.prototype.insert = function(userName) {

		// Check if the linked list is empty
		// so insert first node and lead head
		// points to generic node
		if (this.head === null)
			this.head = new Node(userName);

		else {

			// If linked list is not empty, insert the node
			// at the end of the linked list
			let list = this.head;
			while (list.next) {
				list = list.next;
			}

			// Now here list pointer points to last
			// node let’s insert out new node in it
			list.next = new Node(data)
		}
}

// Function to print linkedList
LinkedList.prototype.iterate = function() {

		// First we will check whether out
		// linked list is empty or node
		if (this.head === null)
			return null;

		// If linked list is not empty we will
		// iterate from each Node and prints
		// it’s value store in “data” property

		let list = this.head;

		// we will iterate until our list variable
		// contains the “Next” value of the last Node
		// i.e-> null
		while (list) {
			document.write(list.rankingNum)
			if (list.next)
				document.write(' -> ')
			list = list.next
		}
}

// Function to mergesort a linked list
LinkedList.prototype.mergeSort = function(list) {

		if (list.next === null)
			return list;

		let count = 0;
		let countList = list
		let leftPart = list;
		let leftPointer = list;
		let rightPart = null;
		let rightPointer = null;

		// Counting the nodes in the received linkedlist
		while (countList.next !== null) {
			count++;
			countList = countList.next;
		}

		// counting the mid of the linked list
		let mid = Math.floor(count / 2)
		let count2 = 0;

		// separating the left and right part with
		// respect to mid node in tke linked list
		while (count2 < mid) {
			count2++;
			leftPointer = leftPointer.next;
		}

		rightPart = new LinkedList(leftPointer.next);
		leftPointer.next = null;

		// Here are two linked list which
		// contains the left most nodes and right
		// most nodes of the mid node
		return this._mergeSort(this.mergeSort(leftPart),
								this.mergeSort(rightPart.head))
}

// Merging both lists in sorted manner
LinkedList.prototype._mergeSort = function(left, right) {

		// Create a new empty linked list
		let result = new LinkedList()

		let resultPointer = result.head;
		let pointerLeft = left;
		let pointerRight = right;


		// If true then add left most node value in result,
		// increment left pointer else do the same in
		// right linked list.
		// This loop will be executed until pointer's of
		// a left node or right node reached null
		while (pointerLeft && pointerRight) {
			let tempNode = null;

			// Check if the right node's value is greater than
			// left node's value
			if (pointerLeft.rankingNum > pointerRight.rankingNum) {
				tempNode = pointerRight.node
				pointerRight = pointerRight.next;
			}
			else {
				tempNode = pointerLeft.rankingNum
				pointerLeft = pointerLeft.next;
			}

			if (result.head == null) {
				result.head = new Node(tempNode)
				resultPointer = result.head
			}
			else {
				resultPointer.next = new Node(tempNode)
				resultPointer = resultPointer.next
			}
		}

		// Add the remaining elements in the last of resultant
		// linked list
		resultPointer.next = pointerLeft;
		while (resultPointer.next)
			resultPointer = resultPointer.next

			resultPointer.next = pointerRight

		// Result is the new sorted linked list
		return result.head;
}
