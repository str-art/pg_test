module.exports = (() => {
  global.beforeExitCleanupTasks = [];

  global.cleanUpExit = (code = "SIGTERM") => {
    console.debug(`Exiting process with code ${code}`);
    executeBeforeExit().finally(() => {
      console.debug(`Node server stoped...`);
      process.exit();
    });
  };

  executeBeforeExit = async () => {
    console.debug(`Starting cleanup`);
    while (beforeExitCleanupTasks.length > 0) {
      let task = beforeExitCleanupTasks.pop();
      if (typeof task !== "function") {
        console.debug(`Wrong cleanup task ${task}`);
        continue;
      }
      try {
        await task();
      } catch (error) {
        console.error(`Failed to execute ${task.name} : ${error.message}`);
      }
    }
    console.debug(`Cleanup finished`);
  };

  [
    "SIGHUP",
    "SIGINT",
    "SIGQUIT",
    "SIGILL",
    "SIGTRAP",
    "SIGABRT",
    "SIGBUS",
    "SIGFPE",
    "SIGUSR1",
    "SIGSEGV",
    "SIGUSR2",
    "SIGTERM",
  ].forEach((code) => {
    process.on(code, cleanUpExit);
  });
})();
