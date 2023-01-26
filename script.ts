import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//const prisma = new PrismaClient({log:["query"]}); - to log the SQL query for each operations

async function main() {
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Thushi",
      email: "thushi@mail.com",
      isAdmin: false,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },

    //to included connected tables

    //this returns everything
    include: {
      userPreference: true,
    },

    //to get only specific things
    //select :{ name:true}
    //this returns only the name  of the user

    //select :{name:true, userPreference:{select :{id:true}}}
    //this returns only name of user and user preference id

    //can only use either select or include
  });

  const users = await prisma.user.createMany({
    data: [
      {
        name: "Thusha",
        email: "thusha@mail.com",
        isAdmin: false,
      },
      {
        name: "Thushik",
        email: "thushik@mail.com",
        isAdmin: false,
      },
    ],
    //can't use select or include inside createMany
    //can't add connections also
  });
  console.log(user, users);
}

//to automatically disconnect once program finishes running
main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
