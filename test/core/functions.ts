import "../setup/setup";
import "../setup/server.setup";
import { strict as assert } from "assert";
import { HMPLRequestInfo } from "../../src/types";
import { createScope, clearScope } from "../server/server";
import { compile, stringify } from "../../src/main";
import type { ScopeOptions } from "./functions.types";

const e = (text: string, block: () => unknown, message: string) => {
  it(text, () => {
    assert.throws(block, {
      message
    });
  });
};

const eq = (text: string, block: unknown, equality: any) => {
  it(text, () => {
    assert.strictEqual(block, equality);
  });
};

const aeq = (
  template: string,
  get: (...args: any[]) => void,
  options: any = {},
  scopeOptions: ScopeOptions = {}
) => {
  it("", async () => {
    const scope = createScope({ ...scopeOptions });
    const req = await new Promise((res) => {
      compile(template)({
        get: (...args) => get(res, ...args),
        ...options
      });
    });
    assert.deepEqual(req, true);
    clearScope(scope);
  });
};

const aeqError = (
  template: string,
  get: (...args: any[]) => void,
  options: any = {},
  scopeOptions: ScopeOptions = {}
) => {
  it("should handle template errors correctly", async () => {
    const scope = createScope({ ...scopeOptions });

    try {
      const req = await new Promise<string>((resolve) => {
        compile(template)({
          get: (...args) => get(resolve, ...args),
          ...options
        });
      });
      assert.deepEqual(req, "true");
    } catch (e) {
      console.error("Error occurred during test:", e);
      throw e;
    } finally {
      clearScope(scope);
    }
  });
};
const defaultGetEl: (el: Element | null | undefined) => Element | undefined = (
  el
) => el?.getElementsByTagName("button")?.[0];

// async equal event
const aeqe = (
  template: string,
  get: (...args: any[]) => void,
  compileOptions: any = {},
  options: any = {},
  scopeOptions: ScopeOptions = {},
  quantity = 1,
  getEl = defaultGetEl,
  event: string = "click",
  eventOptions: EventInit = {
    bubbles: true,
    cancelable: true
  }
) => {
  it("", async () => {
    const scope = createScope({ ...scopeOptions });
    const req = await new Promise((res) => {
      const instance = compile(
        template,
        compileOptions
      )({
        get: (...args) => get(res, ...args),
        ...options
      });
      const el = instance.response;
      const currentEl = getEl(el);
      if (currentEl) {
        for (let i = 0; i < quantity; i++) {
          if (currentEl) {
            const clickEvent = new window.Event(event, eventOptions);
            currentEl.dispatchEvent(clickEvent);
          }
        }
      }
    });
    assert.deepEqual(req, true);
    clearScope(scope);
  });
};

const ae = (
  template: string,
  message: string,
  get: (...args: any[]) => void,
  options: any = {},
  scopeOptions: ScopeOptions = {}
) => {
  it("", async () => {
    const scope = createScope({ ...scopeOptions });
    assert.throws(
      async () => {
        await new Promise((res) => {
          compile(template)({
            get: (...args) => get(res, ...args),
            ...options
          });
        });
      },
      {
        message
      }
    );
    clearScope(scope);
  });
};

const createTestObj1 = (obj: Record<string, any>) => {
  return `<div>{${stringify(obj as HMPLRequestInfo)}}</div>`;
};

const createTestObj2 = (text: string) => {
  return `<div>${text}</div>`;
};
const createTestObj3 = (text: string) => {
  return `<div><button id="click">click</button>${text}</div>`;
};

const createTestObj4 = (text: string) => {
  return `<div><form onsubmit="function prevent(e){e.preventDefault();};return prevent(event);" id="form"></form>${text}</div>`;
};

export {
  e,
  eq,
  ae,
  aeq,
  aeqe,
  aeqError,
  createTestObj1,
  createTestObj2,
  createTestObj3,
  createTestObj4
};
