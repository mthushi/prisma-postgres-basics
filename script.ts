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
      {
        name: "Thushik",
        email: "thushik1@mail.com",
        isAdmin: false,
      },
      {
        name: "Thushik",
        email: "thushik2@mail.com",
        isAdmin: false,
      },
    ],
    //can't use select or include inside createMany
    //can't add connections also
  });
  console.log(user, users);

  //finding users
  //by using any unique attributes existing

  /* 
  const selectedUser = await prisma.user.findUnique({
    where :{
        uniqueFieldName:"uniqueValue",
    }

    //can use select, included as previous
  })
  */

  //for combined ids

  /*
  const user = await prisma.user.findUnique({
    where:{
        //attributes combined to form the id
        age_name:{
            age:27,
            name:"Thushi"
        }
    }
  })
  */

  //non unique - one
  const foundUser = await prisma.user.findFirst({
    where: {
      name: "Thushi",
    },
  });
  console.log("found user", foundUser);

  //non unique - many
  const foundUsers = await prisma.user.findMany({
    where: {
      isAdmin: false,
    },
  });
  console.log("found users", foundUsers);

  //non unique - many
  const foundUsersDistinct = await prisma.user.findMany({
    where: {
      isAdmin: false,
    },
    //returns users with unique names
    distinct: ["name"],
    //can add more properties like, ["name","email"]
  });
  console.log("found users", foundUsersDistinct);

  //non unique - many
  const foundUsersPaginated = await prisma.user.findMany({
    where: {
      isAdmin: false,
    },
    //returns specified number of users
    take: 2,
    //optionally, skip can be added
    skip: 1,
    //skip first user and get next 2

    //ordering
    /*
    orderBy :{
        age:"asc"
    }
    */
  });
  console.log("found users", foundUsersPaginated);

  //non unique - one
  const foundUsersWhere = await prisma.user.findMany({
    where: {
      //different where forms
      name: { equals: "Thushik" },
      isAdmin: { not: true },
      email: { in: ["thushik@mail.com", "thushik1@mail.com"] },
      //email: { notIn: ["thushik@mail.com", "thushik1@mail.com"] },

      //less than => age:{lt:20}
      //greater than => age:{gt:30}
      //less than or equal to => age:{lte:20}

      //contains - email:{contains:"@mail.com"}
      // email:{endsWith:"@mail.com"}
      // email:{startsWith:"@mail.com"}

      //to check both at same time
      /*
      where:{
        AND :[
            {email:{startsWith:"thushi"}},
            {email:{endsWith:".com"}}
        ]
      }
      */

      //can use OR, NOT in similar way
    },
  });
  console.log("found user", foundUsersWhere);
}

//to automatically disconnect once program finishes running
main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
