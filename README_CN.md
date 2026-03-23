# Kong Manager E2E 测试项目

基于 Cypress 的端到端（E2E）自动化测试框架，用于测试 Kong Manager 的 Gateway Services 和 Routes 功能。

---

## 📁 项目结构

```
cypress/
├── e2e/                          # 测试用例目录
│   └── tests/
│       ├── e2e-workflows/        # 端到端完整流程测试
│       │   └── service-and-route.cy.ts
│       ├── gateway-services/     # Gateway Service 相关测试
│       │   ├── create.cy.ts
│       │   └── navigation.cy.ts
│       └── routes/               # Route 相关测试
│           ├── create.cy.ts
│           └── navigation.cy.ts
├── pages/                        # Page Object Model (POM)
│   ├── base/
│   │   └── BasePage.ts           # 所有 Page 类的基类
│   ├── gateway-service/
│   │   ├── GatewayServiceFormPage.ts
│   │   ├── GatewayServicesListPage.ts
│   │   └── index.ts
│   ├── route/
│   │   ├── CreateRoutePage.ts
│   │   ├── RouteManagementPage.ts
│   │   └── index.ts
│   └── workspace/
│       ├── OverviewPage.ts
│       ├── WorkspacesPage.ts
│       └── index.ts
└── support/                      # 测试支持文件
    └── e2e.ts
```

---

## 🏗️ 各层作用说明

### 1. `cypress/e2e/tests/` - 测试层
存放所有测试用例，按功能模块组织：

| 目录 | 说明 | 示例 |
|------|------|------|
| `e2e-workflows/` | 端到端完整流程测试 | 创建 Service → 添加 Route → 验证代理 |
| `gateway-services/` | Gateway Service 功能测试 | 创建、导航、表单验证 |
| `routes/` | Route 功能测试 | 创建 Route、重复名称验证 |

### 2. `cypress/pages/` - Page Object 层
使用 Page Object Model 模式封装页面元素和操作：

| 文件 | 职责 |
|------|------|
| `BasePage.ts` | 提供通用方法：`visit()`、`waitForPageLoad()`、`urlShouldContain()` 等 |
| `*Page.ts` | 每个页面对应一个类，封装该页面的选择器（selectors）和操作方法 |
| `index.ts` | 模块导出文件，方便批量导入 |

**设计原则：**
- 选择器集中定义在 `selectors` 对象中
- 操作方法命名清晰：`clickXXX()`、`verifyXXX()`、`enterXXX()`
- 返回 Cypress Chainable 以便链式调用

### 3. `cypress/support/` - 支持层
存放测试辅助文件：
- `e2e.ts`: 全局 before/after hooks、自定义命令

---

## ➕ 如何添加新文件

### 添加新的 Page 文件

1. **在 `cypress/pages/` 下创建文件**
   ```
   cypress/pages/new-module/NewFeaturePage.ts
   ```

2. **继承 BasePage 并定义选择器**
   ```typescript
   import { BasePage } from '../base/BasePage';

   export class NewFeaturePage extends BasePage {
     readonly selectors = {
       // 使用 data-testid 优先
       featureInput: '[data-testid="feature-input"]',
       submitButton: '[data-testid="submit-btn"]',
     };

     constructor() {
       super('http://localhost:8002/default/feature');
     }

     // 操作方法
     enterFeatureName(name: string): void {
       cy.get(this.selectors.featureInput).clear().type(name);
     }

     clickSubmit(): void {
       cy.get(this.selectors.submitButton).click();
     }
   }
   ```

3. **在 `index.ts` 中导出**
   ```typescript
   // cypress/pages/new-module/index.ts
   export { NewFeaturePage } from './NewFeaturePage';
   ```

4. **在 `cypress/pages/index.ts` 中注册模块**
   ```typescript
   export * from './new-module';
   ```

### 添加新的测试文件

1. **在相应目录创建 `.cy.ts` 文件**
   ```
   cypress/e2e/tests/new-module/feature.cy.ts
   ```

2. **编写测试结构**
   ```typescript
   import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
   import { NewFeaturePage } from '../../../pages/new-module/NewFeaturePage';

   describe('New Feature Tests', () => {
     const workspacesPage = new WorkspacesPage();
     const newFeaturePage = new NewFeaturePage();

     beforeEach(() => {
       workspacesPage.navigateToWorkspaces();
       workspacesPage.clickDefaultRow();
     });

     it('should test something', () => {
       // 测试步骤
       newFeaturePage.enterFeatureName('test');
       newFeaturePage.clickSubmit();
       
       // 断言
       cy.contains('Success').should('be.visible');
     });
   });
   ```

3. **在 `cypress.config.ts` 中注册（如需要）**
   ```typescript
   specPattern: [
     "cypress/e2e/tests/gateway-services/**/*.cy.ts",
     "cypress/e2e/tests/routes/**/*.cy.ts",
     "cypress/e2e/tests/new-module/**/*.cy.ts",  // 添加新行
   ],
   ```

---

## 🚀 执行测试的方式

### 1. 打开 Cypress 测试运行器（推荐开发使用）
```bash
npx cypress open
```
- 可视化选择并运行测试
- 支持调试和查看实时执行

### 2. 命令行运行所有测试
```bash
npx cypress run
```

### 3. 运行特定测试文件
```bash
npx cypress run --spec "cypress/e2e/tests/routes/create.cy.ts"
```

### 4. 运行特定目录的测试
```bash
npx cypress run --spec "cypress/e2e/tests/routes/**/*.cy.ts"
```

### 5. 指定浏览器运行
```bash
npx cypress run --browser chrome
npx cypress run --browser edge
```

### 6. 无头模式（CI/CD 使用）
```bash
npx cypress run --headless
```

### 7. 运行特定测试（使用 grep）
```bash
# 运行包含 "create" 的测试
npx cypress run --env grep="create"
```

---

## 📝 编写测试的最佳实践

### 1. 选择器规范
- **优先使用 `data-testid`**：稳定且不易因 UI 变更而失效
  ```typescript
  // ✅ 推荐
  myInput: '[data-testid="route-form-name"]'
  
  // ❌ 不推荐
  myInput: '.form-control input[type="text"]'
  ```

### 2. 等待策略
- 使用 Cypress 的自动等待机制
- 必要时添加显式等待：
  ```typescript
  cy.wait(500);  // 等待页面过渡
  cy.get('[data-testid="element"]', { timeout: 10000 }).should('be.visible');
  ```

### 3. 条件测试
- 使用 `.then()` 处理异步结果
  ```typescript
  gatewayServicesList.hasEnabledService().then((hasEnabled) => {
    if (hasEnabled) {
      // 执行操作
    } else {
      cy.log('No enabled services found');
    }
  });
  ```

### 4. 生成随机数据
- 使用 Page 类提供的随机数据生成方法
  ```typescript
  const routeName = createRoutePage.generateRouteName();
  // 结果: phoebe-example-route-XXX
  ```

### 5. 跳过不稳定的测试
- 使用 `it.skip()` 临时跳过
- 使用 `it.only()` 只运行特定测试

---

## ⚙️ 配置说明

### Cypress 配置 (`cypress.config.ts`)

| 配置项 | 说明 | 当前值 |
|--------|------|--------|
| `baseUrl` | 测试的基础 URL | `http://localhost:8002` |
| `viewportWidth` | 视口宽度 | `1280` |
| `viewportHeight` | 视口高度 | `720` |
| `video` | 是否录制视频 | `true` |
| `screenshotOnRunFailure` | 失败时截图 | `true` |
| `specPattern` | 测试文件匹配模式 | 见配置文件 |

### TypeScript 配置
- 项目使用 TypeScript 编写
- 运行前会执行类型检查：`npx tsc --noEmit`

---

## 🔧 环境要求

- **Node.js**: >= 16.x
- **Cypress**: ^15.12.0
- **TypeScript**: ^5.9.3

### 安装依赖
```bash
npm install
```

---

## 📊 测试报告

### 视频和截图
- **视频**: 保存在 `cypress/videos/`
- **失败截图**: 自动保存在 `cypress/screenshots/`

### 查看结果
```bash
# 运行测试后查看
ls cypress/videos/
ls cypress/screenshots/
```

---

## 🐛 常见问题

### 1. 元素找不到
- 检查 `data-testid` 是否正确
- 添加适当的等待时间
- 使用 `{ timeout: 10000 }` 增加超时

### 2. 测试不稳定
- 确保页面完全加载后再操作
- 使用 `cy.wait()` 等待 API 响应
- 避免硬编码的等待时间，优先使用 Cypress 的自动等待

### 3. 类型检查错误
```bash
# 运行类型检查
npx tsc --noEmit
```

---

## 📚 参考资源

- [Cypress 官方文档](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

---

## 🎯 项目维护

- 定期清理未使用的代码
- 保持 Page 类的选择器更新
- 及时修复废弃的测试用例
