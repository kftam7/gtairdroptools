// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// ============ Imports ============

//import { ERC20 } from "@solmate/tokens/ERC20.sol"; // Solmate: ERC20
//import { MerkleProof } from "@openzeppelin/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof

//import { ERC20 } from "solmate/src/tokens/ERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title MerkleClaimERC20
/// @notice ERC20 claimable by members of a merkle tree
/// @author Anish Agnihotri <contact@anishagnihotri.com>
/// @dev Solmate ERC20 includes unused _burn logic that can be removed to optimize deployment cost
contract MerkleClaim {

  /// ============ Immutable storage ============

  /// @notice ERC20-claimee inclusion root
  // bytes32 public immutable merkleRoot;
  bytes32 public merkleRoot;

  address public contractAddr;

  address owner;

  uint public startTimestamp;
  uint public endTimestamp;

  /// ============ Mutable storage ============

  /// @notice Mapping of addresses who have claimed tokens
  mapping(address => bool) public hasClaimed;

  /// ============ Errors ============

  /// @notice Thrown if address has already claimed
  error AlreadyClaimed();
  /// @notice Thrown if address/amount are not part of Merkle tree
  error NotInMerkle();
  /// @notice Thrown if time is not within campaign period
  error NotWithinPeriod();

  /// ============ Constructor ============

  /// @notice Creates a new MerkleClaimERC20 contract
  /// @param _name of token
  /// @param _symbol of token
  /// @param _decimals of token
  /// @param _merkleRoot of claimees
  
  ///constructor(
  ///  string memory _name,
  ///  string memory _symbol,
  ///  uint8 _decimals,
  ///  bytes32 _merkleRoot
  ///) ERC20(_name, _symbol, _decimals) {
  ///  merkleRoot = _merkleRoot; // Update root
  ///}
  
  //constructor (address addr, bytes32 merkleroot){
  constructor (address _addr, bytes32 _merkleRoot, uint _startTimestamp, uint _endTimestamp){
      owner = msg.sender;
      contractAddr = _addr;
      merkleRoot = _merkleRoot;
      startTimestamp = _startTimestamp;
      endTimestamp = _endTimestamp;
  }

  /// ============ Events ============

  /// @notice Emitted after a successful token claim
  /// @param to recipient of claim
  /// @param amount of tokens claimed
  event Claim(address indexed to, uint256 amount);


  //function getMerkleroot() public view returns (bytes32) {
  //    return merkleRoot;
  //}

  // change Merkleroot
  function changeMerkleroot(bytes32 _merkleRoot) public  {
      require(owner == msg.sender);
      merkleRoot = _merkleRoot;
  }

  // change start & end time of campaign
  function changeStartTimestamp(uint _startTimestamp, uint _endTimestamp) public  {
      require(owner == msg.sender);
      startTimestamp = _startTimestamp;
      endTimestamp = _endTimestamp;
  }

  /// ============ Functions ============

  /// @notice Allows claiming tokens if address is part of merkle tree
  /// @param to address of claimee
  /// @param amount of tokens owed to claimee
  /// @param proof merkle proof to prove address and amount are in tree
  function claim(address to, uint256 amount, bytes32[] calldata proof) external {

    // Verify if within campaign period
    if (block.timestamp > endTimestamp || block.timestamp < startTimestamp) revert NotWithinPeriod();

    // Throw if address has already claimed tokens
    if (hasClaimed[to]) revert AlreadyClaimed();

    // Verify merkle proof, or revert if not in tree
    bytes32 leaf = keccak256(abi.encodePacked(to, amount));
    bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
    if (!isValidLeaf) revert NotInMerkle();

    // Set address to claimed
    hasClaimed[to] = true;

    // Mint tokens to address
    //_mint(to, amount);
    IERC20(contractAddr).transfer(to, amount);

    // Emit claim event
    emit Claim(to, amount);
    
  }
}
