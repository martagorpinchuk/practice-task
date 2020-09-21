const faker = require('faker');

const generateUser = ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  department,
  createdAt = new Date()
} = {}) => ({
  firstName,
  lastName,
  department,
  createdAt
});

const generareArticle = ({
  title = faker.name.title(),
  department,
  tagList
} = {}) => ({
  title,
  department,
  tagList
});

module.exports = {
  mapUser: generateUser,
  mapArticle: generareArticle,
  getRandomFirstName: () => faker.name.firstName()
};
