'use strict'

const {mapUser, getRandomFirstName, mapArticle} = require('./util');

// db connection and settings
const connection = require('./config/connection');
const { Db } = require('mongodb');
let userCollection
let articleCollection
//run();
runArticles();

async function run() {
  await connection.connect();
  //await connection.get().dropCollection('users');
  userCollection = connection.get().collection('users');

  await example1();
  await example2();
  await example3();
  await example4();
  await connection.close();
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1() {
  const departments = ['a', 'a', 'b', 'b', 'c', 'c'];
  const users = departments.map( d => ({department: d}) ).map(mapUser);

  try {
    const {result} = await userCollection.insertMany(users);
    console.log(`Added ${result.n} users`);
//   console.log(users)
  } catch (err) {
    console.error(err)
  }
}

// - Delete 1 user from department (a)

async function example2() {
  try {
    const {result} =await userCollection.deleteOne({department:'a'});
    console.log(`Removed ${result.n} user`);
  } catch (err) {
    console.error(err)
  }
}

// - Update firstName for users from department (b)

async function example3() {
  try {
    const usersB = await userCollection.find({department: 'b'}).toArray()
     const bulkWrite = usersB.map(user => ({
       updateOne: {
         filter: {_id: user._id},
         update: {$set: {firstName: getRandomFirstName()}}
       }
     }))
     const {result} = await userCollection.bulkWrite(bulkWrite)
     console.log(`Updated ${result.nModified} users`)
  } catch (err) {
    console.error(err)
  }
}

// - Find all users from department (c)
async function example4() {
  try {
    const [find, projection] = [{department: 'c'}, {firstName: 1}];
    const users = [...(await userCollection.find(find, projection).toArray())].map(mapUser);
    console.log(`Users:`);
    users.forEach(console.log);
  } catch (err) {
    console.error(err)
  }
}

// HOMETASK STARTS HERE
// ### Articles

async function runArticles() {
  await connection.connect();
  //await connection.get().dropCollection('articles')
  articleCollection = connection.get().collection('articles');

  await example1Articles();
  await example2Articles();
  await example3Articles();
  await example4Articles();
  await example5Articles();
  await connection.close();
}

// Create 5 articles per each type (a, b, c)
async function example1Articles() {
  const departments = [ 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'c', 'c'];
  const articles = departments.map( d => ({department: d})).map(mapArticle);

  try{
    const {result} = await articleCollection.insertMany(articles);
    console.log(`Added ${result.n} articles`);
  } catch(err) {
    console.log(err)
  }
}

// Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]
async function example2Articles() {
  try{
    const articleA = await articleCollection.find({department: 'a'}).toArray();
    const bulkWrite = articleA.map(article => ({
      updateOne: {
          filter: {_id: article._id},
          update: {$set: {tagList: ['tag1-a', 'tag2-a', 'tag3']}}
      }
    }));
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Updated articles a: ${result.nModified}`);
  } catch(err) {
    console.log(err)
  }
}

// Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a
async function example3Articles() {
  try{
    const articleBC = await articleCollection.find({$or: [{department: 'b'}, {department: 'c'}]}).toArray();
    const bulkWrite = articleBC.map(article => ({
      updateOne: {
        filter: {_id: article._id},
        update: {$set: {tagList: ['tag2', 'tag3', 'super']}}
      }
    }));
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Added to articles b, c ${result.nModified}`);
  } catch(err) {
    console.log(err)
  }
}

// Find all articles that contains tags [tag2, tag1-a]
async function example4Articles() {
  const articles = await articleCollection.find({tagList: {$in: ['tag2', 'tag1-a']}}).toArray();
  try{
    console.log("all articles that contains tags [tag2, tag1-a]")
  //  articles.forEach(console.log)
  } catch(err) {
    console.log(err)
  }
}

// Pull [tag2, tag1-a] from all articles
async function example5Articles() {
  try{
    const articles = await articleCollection.find({tagList: {$in: ['tag2', 'tag1-a']}}).toArray();
    const bulkWrite = articles.map(article => ({
      updateOne: {
        filter: {_id: article._id},
        update: {$pull: {tagList: {$in: ['tag2', 'tag1-a']}}}
      }
    }))
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Updated articles a: ${result.nModified}`);
  } catch(err) {
    console.log(err)
  }
}