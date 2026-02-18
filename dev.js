const { spawn } = require('child_process');

// Function to run a command
function runCommand(command, args, name) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (error) => {
    console.error(`${name} failed to start: ${error.message}`);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`${name} process exited with code ${code}`);
    }
  });

  return child;
}

console.log('Starting Backend...');
runCommand('npm', ['run', 'start'], 'Backend');

console.log('Starting Frontend...');
runCommand('npm', ['run', 'client'], 'Frontend');
