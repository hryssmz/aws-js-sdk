# README

## 1. Setup

---

### 1.1. Initialize Project

---

```bash
mkdir aws-js-sdk
cd aws-js-sdk/
npm init -y
```

### 1.2. Development Dependencies

---

#### 1.2.1. TypeScript

---

```bash
npm install -D ts-node @types/node
# npx tsc --init
```

#### 1.2.2. Prettier

---

```bash
npm install -D prettier prettier-plugin-sh
```

#### 1.2.3. ESLint

---

```bash
# npm install -D eslint eslint-config-prettier
npm init @eslint/config
npm install -D eslint-config-prettier
```

```log
$ npm init @eslint/config
Need to install the following packages:
  @eslint/create-config
Ok to proceed? (y) y
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ What format do you want your config file to be in? · JavaScript

Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
✔ Would you like to install them now with npm? · No / Yes
Installing @typescript-eslint/eslint-plugin@latest, @typescript-eslint/parser@latest, eslint@latest

added 129 packages, and audited 149 packages in 5s

34 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created .eslintrc.js file in /home/hryssmz/projects/hackernews-graphql/hackernews-node
```

#### 1.2.4. nodemon

---

```bash
npm install -D nodemon
```

#### 1.2.5. Jest

---

```bash
npm install -D jest @types/jest eslint-plugin-jest
# npx jest --init
```

#### 1.2.6. Babel

---

```bash
npm install -D babel-jest @babel/core @babel/preset-env @babel/preset-typescript
```

### 1.3. Initialize Express Project

---

#### 1.3.1. AWS SDK

---

```bash
npm install @aws-sdk/client-api-gateway
npm install @aws-sdk/client-apigatewayv2
npm install @aws-sdk/client-ec2
npm install @aws-sdk/client-iam
npm install @aws-sdk/client-lambda
npm install @aws-sdk/client-s3
npm install @aws-sdk/client-sts
npm install @aws-sdk/s3-request-presigner
```

#### 1.3.2. Axios

---

```bash
npm install axios
```

#### 1.3.3. archiver

---

```bash
npm install archiver
npm install -D @types/archiver
```

#### 1.3.4. luxon

---

```bash
npm install luxon
npm install -D @types/luxon
```

#### 1.3.5. crypto-js

---

```bash
npm install crypto-js
npm install -D @types/crypto-js
```
