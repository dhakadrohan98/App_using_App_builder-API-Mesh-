# App_using_App_builder_Premium:

App built using app builder &amp; it can call adobe API mesh &amp; get response data. 

Prerequisites:

Adobe Developer Console (required):
            - Adobe Developer Console gives you access to APIs, SDKs and developer tools. You will set up your credentials using the Developer Console.
*Note*: You need a developer or system admin role for your Adobe Experience Cloud IMS organization.

Local Environment Set Up:
- NodeJS >=12.22 ... 14.17-LTS, (odd versions are not recommended). It should also install npm together.Recommended using nvm to manage NodeJS installation and versions.
- Install Adobe I/O CLI using npm install -g @adobe/aio-cli
     - If you have Adobe I/O CLI installed, please ensure you have the latest version.
     - Check CLI version using aio --version and compare it with npm show @adobe/aio-cli version. If your CLI is outdated, update by running npm install -g              @adobe/aio-cli.
     - Even if your Adobe I/O CLI is up to date, run aio update to ensure all core plugins are updated as well.

[Optional Tools]
The following is required if you intend to use local development features provided by the CLI:

- Visual Studio Code (VS Code) as the supported IDE for editor, debuggger, etc. You can use any other IDE as a code editor, but advanced usage (e.g. debugger) is not yet supported.
- Java Development Kit (JDK) (at least Java 11)
- Chrome debugger extension in VSCode
- Docker Desktop

Now that you have your environment set up, you can start creating your own App Builder application.

Signing in from CLI & creating app using CLI:
      1. On your machine, navigate to the Terminal and enter aio login
      2. A browser window should open, asking you to sign in with your Adobe ID.
      
Bootstrapping new App using the CLI:
      1. In your Terminal, navigate to where you want to initialize your project and type in the following command in your Terminal:
            aio app init <app_name>


