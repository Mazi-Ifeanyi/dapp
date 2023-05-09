// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;
/**
 * @author Tony Ushe - JobCrypt ©2023
 * @title IJobPostingInstantiator
 * @dev 
 */
interface IJobPostingInstantiator {

   function getPostingAddress(address _owner, address _product) external returns (address _jobPostingAddress);

}