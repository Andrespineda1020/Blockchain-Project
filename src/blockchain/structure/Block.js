const ChainUtil = require('./chain-util');


class Block{
      constructor(timestamp,lastHash,hash,address1, address2,publicKey1, publicKey2, value1, value2) {
        this.address1 = address1;
        this.address2 = address2;
        this.publicKey1 = publicKey1;
        this.publicKey2 = publicKey2;
        this.user1Value = value1;
        this.user2Value = value2;
        this.next = null;
        this.timestamp = timestamp;
        this.lastHash = lastHash;

    }

    /**
     * returns what the object looks like
     * substring is used to make it look nice
     * hashes are too big to printed on command line
     */

    toString(){
        return `Block -
        Address1 : ${this.address1}
        Address2 : ${this.address2}
        publicKey1 : ${this.publicKey1}
        publicKey2: ${this.publicKey2}
        user1Value : ${this.user1Value}
        user2Value : ${this.user2Value}
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}}`;
    }

    /**
     * function to create the first block or the genesis block
     */

    static genesis(){
        //return new Block();
    }

    /**
     * function to create new blocks or to mine new blocks
     */

    static mineBlock(Block){
        let hash = this.blockHash(Block);
        if (hash == Block.lastHash)
          return true;
    return false;
    }

    /**
     * function to create the hash value of the block data
     */

    static hash(timestamp,address1, address2,public_key1, public_key2, user1_value, user2_value2,ranking,curent_rank,isPending,isComplete){
        return ChainUtil.hash(`${timestamp}${address1}${address2}${public_key1}${public_key2}${user1_value}${user2_value2}${ranking}${curent_rank}${isPending}${isComplete}`).toString();
    }

    /**
     * return the hash value of the passed block
     */

    static blockHash(block){
        //destructuring
        const {timestamp,address1, address2,public_key1, public_key2, user1_value, user2_value2,ranking,curent_rank,isPending,isComplete } = block;
        return Block.hash(timestamp,address1, address2,public_key1, public_key2, user1_value, user2_value2,ranking,curent_rank,isPending,isComplete);
    }

}

// share this class by exporting it

module.exports = Block;