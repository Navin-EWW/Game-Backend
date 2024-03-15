export default function (plop) {
  /* welcome message that will display in CLI */
  plop.setWelcomeMessage(
    "Welcome to plop! What type of file would you like to generate?"
  );

  plop.setHelper("actualName", function (fullNameWithPath) {
    return fullNameWithPath.data.root.name.split("/").pop();
  });
  plop.setHelper("camelCaseActualName", function (fullNameWithPath) {
    const name = fullNameWithPath.data.root.name.split("/").pop();
    return name.charAt(0).toLowerCase() + name.slice(1);
  });

  plop.setGenerator("controller", {
    description: "create a new controller",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "controller name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/http/controllers/{{name}}.ts",
        templateFile: "cli-templates/controller.hbs",
      },
    ],
  });

  plop.setGenerator("service", {
    description: "create a new service file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "service file name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/services/{{name}}.ts",
        templateFile: "cli-templates/service.hbs",
      },
    ],
  });

  plop.setGenerator("request", {
    description: "create request validation class",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "request class name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/http/requests/{{name}}.ts",
        templateFile: "cli-templates/request.hbs",
      },
    ],
  });

  plop.setGenerator("response", {
    description: "create response file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "response file name:",
      },
      {
        type: "input",
        name: "Model",
        message: "mode name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/http/responses/{{name}}.ts",
        templateFile: "cli-templates/response.hbs",
      },
    ],
  });

  plop.setGenerator("route", {
    description: "create route file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "route name:",
      },
      {
        name: "input",
        name: "requiresAuth",
        message: "requires auth:",
        choices: ["yes", "no"],
      },
    ],
    actions: function (data) {
      const toImportIntoFile = data.name.split("/")[0];
      const actions = [
        {
          type: "add",
          path: "src/routes/{{name}}.ts",
          templateFile: "cli-templates/route.hbs",
        },
        {
          type: "modify",
          path: `src/routes/${toImportIntoFile}/${toImportIntoFile}.ts`,
          pattern: /(\/\/ROUTES IMPORT)/g,
          template:
            "import  {{actualName}}Router  from './{{actualName}}';\n$1",
        },
      ];

      if (data.requiresAuth === "yes  ") {
        actions.push({
          type: "modify",
          path: `src/routes/${toImportIntoFile}/${toImportIntoFile}.ts`,
          pattern: /(\/\/ROUTERS USE ADD HERE)/g,
          template:
            "router.use('/{{actualName}}  ', {{actualName}}Router);\n$1",
        });
      } else {
        actions.push({
          type: "modify",
          path: `src/routes/${toImportIntoFile}/${toImportIntoFile}.ts`,
          pattern: /(\/\/ROUTERS USE ADD HERE)/g,
          template:
            "router.use('/{{actualName}}',verifyToken,{{actualName}}Router);\n$1",
        });
      }

      return actions;
    },
  });

  plop.setGenerator("job", {
    description: "create background job file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "job name:",
      },
    ],
    actions: function (data) {
      const toImportIntoFile = data.name.split("/")[0];
      const actions = [
        {
          type: "add",
          path: "src/app/jobs/{{name}}.ts",
          templateFile: "cli-templates/jobs.hbs",
        },
        {
          type: "modify",
          path: `src/app/providers/queues.ts`,
          pattern: /(\/\/IMPORT QUEUES HERE)/g,
          template:
            "import  { {{actualName}}Queue }  from '../jobs/{{actualName}}';\n$1",
        },
        {
          type: "modify",
          path: `src/app/providers/queues.ts`,
          pattern: /(\/\/ADD ADAPTERS HERE)/g,
          template: " new BullMQAdapter({{actualName}}Queue), \n$1",
        },
      ];

      return actions;
    },
  });

  plop.setGenerator("mail", {
    description: "create an email template",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "template name:",
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: "add",
          path: "src/app/mails/{{name}}.ts",
          templateFile: "cli-templates/mail.hbs",
        },
        {
          type: "add",
          path: "src/views/email/{{camelCaseActualName}}.hbs",
          templateFile: "cli-templates/mail_view.hbs",
        },
      ];

      return actions;
    },
  });
}
