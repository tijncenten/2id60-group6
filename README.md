# 2id60-group6

## About

A social media web app for the course Web Technology

## Setup

After cloning the repository to your pc, setup the project by running the [init.bat](init.bat) file.
Before running the init file, make sure that python and nodeJS are installed.
Furthermore, for Django Channels, make sure that [visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools) is installed.

When the redis installation starts, choose to include the PATH environment.

## Building

The project can be built for development by running the command `npm run devBuild` in the nodeJS folder. By running the command `npm run prodBuild` the project will be build for production.

### Using Atom

If you are using Atom, some atom packages can be installed for easily building the project.
Run the following command to install the atom packages:

```
apm install --packages-file package-list.txt
```

Pressing `ctrl-alt-b` will start the building process

### Using Visual Studio Code

Visual studio code should be working out of the box.

Press `ctrl-shift-b` to start the building process
