import { faker } from '@faker-js/faker';

export function mockUsers(length) {
  const createRowData = rowIndex => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // const gender = faker.name.gender(true) as 'female' | 'male';
    // const name = faker.name.findName(firstName, lastName, gender);
    const name = faker.name.fullName(firstName, lastName);
    const avatar = faker.image.avatar();

    const city = faker.address.city();
    const street = faker.address.street();
    const email = faker.internet.email();
    const postcode = faker.address.zipCode();
    const phone = faker.phone.number();
    const amount = faker.finance.amount(1000, 90000);

    const age = Math.floor(Math.random() * 30) + 18;
    const stars = Math.floor(Math.random() * 10000);
    const followers = Math.floor(Math.random() * 10000);
    const rating = 2 + Math.floor(Math.random() * 3);
    const progress = Math.floor(Math.random() * 100);
    const jobType = faker.name.jobType();
    const description = faker.commerce.productDescription();

    return {
      id: rowIndex + 1,
      name,
      firstName,
      lastName,
      avatar,
      city,
      street,
      postcode,
      email,
      phone,
      age,
      stars,
      followers,
      rating,
      progress,
      amount,
      jobType,
      description,
    };
  };

  return Array.from({ length }).map((_, index) => {
    return createRowData(index);
  });
}