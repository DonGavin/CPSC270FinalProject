# Github for Dummies! (Yes that means you)

## To Start

Make sure you have:
- [Git](https://git-scm.com/downloads) installed on your computer

## Cloning a Remote Repository
- A Remote Repository is exactly what you're viewing right now, it allows us to share files and document changes easily
## What is Cloning?
- Cloning is the practice of essentially copying the remote repository to your local device
- Through cloning the repository you have easy access to it, and are able to work within branches
- We need to clone because if we did not this project would essentially turn into an unorganized Cluster F#$%

### Make your clone 

1. Launch Visual Studio Code
2. Click on the Source Control icon in the Activity Bar (or press `Ctrl+Shift+G`)
3. Click "Clone Repository"
4. Enter the URL of the GitHub repository you want to clone
5. Select a local folder where you want the repository to be saved
6. When prompted, open the cloned repository

### OR if you want to feel like a *cool hacker* and use the Command Line 

1. Open Terminal in VSCode (Terminal > New Terminal)
2. Navigate to the directory where you want to clone the repository
3. Run the clone command:
   ```
   git clone https://github.com/username/repository-name.git
   ```
4. Open the cloned project:
   ```
   cd repository-name
   code .
   ```

## Branches (The Next Step) 

### Viewing Branches

1. Click on the branch name in the bottom-left corner of VSCode
2. This displays all local and remote branches

### What is a Branch?
- As mentioned above a branch is your own personal area to code in
- We make branches so when we commit changes to the code, we don't break the entire program
- You should **NEVER** commit changes directly to the main branch
- In our case the main branch is named master
- Commit changes only to your own branch, until we meet next in class
- When we meet next in class or outside of class as a group we can discuss changes before implementing them as a whole

### Creating a New Branch (You Should already have cloned the repository at this point)

#### Using VSCode:
1. Click on the branch name in the status bar (bottom-left)
2. Select "Create new branch"
3. Enter a name for your new branch
4. Press Enter

### Switching Between Branches

#### Using VSCode:
1. Click on the branch name in the status bar
2. Select the branch you want to switch to

### Making Changes in Your Branch

1. Make your code changes in VSCode (You shouldn't ever have to really go online) 
2. Stage changes by clicking the "+" next to modified files in the Source Control panel (or by pressing `Ctrl+S`)
3. Enter a commit message in the text field
4. Click the checkmark icon (or press `Ctrl+Enter`) to commit

### Pushing Changes to GitHub

#### Using VSCode:
1. Click "..." in the Source Control panel
2. Select "Push"
3. If it's your first push to this branch, select "Publish Branch"
4. **DO NOT** push to the main branch before discussing in class

#### Using Command Line:
```
git push origin my-branch-name
```

### Pulling the Latest Changes
- You might be asking "But Surfur Gav! When do I push!"
  Great question, this is why you're my favorite!
- You should pull ONLY from the main for the time being after any new changes are commited to the main branch
- When you pull (grab the newest version of the code) there will be options to merge
- When you merge you can choose what to keep from the updated version, and if you'd like to keep anything from yours
- For example if the merge version has nothing to do with the file you're editing, simply keep the file you're working on, and merge all other changes
#### Pulling in VSCode:
1. Click "..." in the Source Control panel
2. Select "Pull"


## What do these Git Commands do?

- `git commit -m "message"`: Commit staged changes
  1. To commit is to publish this change as a snap shot
  2. It allows you to look for errors or difficulties that could arise
  3. You must always commit before pushing 
- `git push`: Push commits to remote repository
  1. Pushing permanently alters a branch in the repository
  2. It takes the changes you commited, and *pushes* them onto the branch
  3. Remember to **never** push changes to the main branch unless we meet and discuss first
- `git pull`: Fetch and merge changes from remote repository
  1. Once you perform your initial clone, you will need to *pull* any changes made to the main branch
  2. Pulling from the main branch will ensure your code is up to date, and that any changes you've made work with the current version 
- `git branch -d branch-name`: Delete a branch locally

## In Summary 

1. **Pull before push**: Always pull the latest changes before pushing to avoid conflicts
2. **Commit Commit Commit**: Make small, focused commits with clear messages. More frequent commits rather than periodic **GIANT** ones
3. **Use descriptive branch names**: Name branches according to the feature/bug you're working on, but Try not to bloat the repo with too many
4. **Keep your branch up to date**: Regularly merge changes from the **main branch into your branch
5. **DO NOT**
6. **Delete merged branches**: Clean up branches after they've been merged

### Merge Conflicts
1. Open the files with conflicts/errors in VSCode
2. Look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Edit the files to resolve conflicts
4. Stage the fixed files
5. Commit the changes

### Uncommitted Changes Error When Switching Branches
- Commit your changes before switching

# Running and Working with the app
- Edit the `src/App.tsx` file to start working on the app.

## Running the app

- Install the dependencies:

  ```sh
  npm install
  ```

- Start the development server:

  ```sh
  npm start
  ```

- Build and run iOS and Android development builds:

  ```sh
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

## Notes


The `ios` and `android` folder are gitignored in the project by default as they are automatically generated during the build process ([Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)). This means that you should not edit these folders directly and use [config plugins](https://docs.expo.dev/config-plugins/) instead. However, if you need to edit these folders, you can remove them from the `.gitignore` file so that they are tracked by git.
