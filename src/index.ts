import {
  ArrowFunctionExpression as TSArrowFunctionExpression,
  FunctionExpression as TSFunctionExpression
} from "@typescript-eslint/types/dist/ts-estree";
import { Rule } from "eslint";
import {
  ArrowFunctionExpression,
  BaseFunction,
  BaseNode,
  FunctionExpression,
  ReturnStatement,
  Statement
} from "estree";

// Tips:
// - Open https://astexplorer.net/
//   - Set language 'JavaScript'
//   - Set parser to '@typescript-eslint/parser'
//   - Paste some code in (that you want to observe the AST of)
// - Return a method named 'X' from 'create' below, where 'X' is the node type you're interested in visiting.
// - Use 'context.report' to report rule violations.

function isReturnStatement(statement: Statement): statement is ReturnStatement {
  return statement.type === "ReturnStatement";
}

function checkBlockStatement(context: Rule.RuleContext, node: BaseFunction): void {
  if (node.body.type === "BlockStatement") {
    const returnStatements = node.body.body.filter(isReturnStatement);
    const methodContainsObjectLiteralReturn = returnStatements.some(
      returnStatement => returnStatement.argument?.type === "ObjectExpression"
    );
    if (methodContainsObjectLiteralReturn) {
      requireReturnType(context, node);
    }
  }
}

function requireReturnType(context: Rule.RuleContext, node: BaseNode): void {
  context.report({
    node: node as any,
    message: "Return type missing"
  });
}

export const rules: Record<string, Rule.RuleModule> = {
  "require-return-types-for-object-literals": {
    meta: {
      fixable: "code",
      type: "problem"
    },
    create(context: Rule.RuleContext) {
      return {
        ArrowFunctionExpression(node: ArrowFunctionExpression): void {
          const tsNode = node as TSArrowFunctionExpression;
          if (tsNode.returnType === undefined) {
            if (node.body.type === "ObjectExpression") {
              requireReturnType(context, node);
            } else {
              checkBlockStatement(context, node);
            }
          }
        },
        FunctionExpression(node: FunctionExpression): void {
          const tsNode = node as TSFunctionExpression;
          if (tsNode.returnType === undefined) {
            checkBlockStatement(context, node);
          }
        }
      };
    }
  }
};
